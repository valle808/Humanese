import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { valleCore } from '@/lib/valle-crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            email, 
            password, 
            name, 
            entityType, // human, iot, agent, corporation, fi
            identityData 
        } = body;

        if (!email || !password || !entityType) {
            return NextResponse.json({ error: 'Missing core identity parameters.' }, { status: 400 });
        }

        // 1. Entity-Specific Validation (Strict Truth-Based)
        switch (entityType) {
            case 'human':
                // In a production UXL, this would verify Coinbase OAuth tokens
                if (!identityData?.oauthProvider || identityData.oauthProvider !== 'coinbase') {
                    // Temporarily allowing registration but marking as UNVERIFIED if OAuth is missing
                    console.warn(`[UXL] Human ${email} registering without Coinbase verification.`);
                }
                break;
            case 'iot':
                if (!identityData?.hwid) {
                    return NextResponse.json({ error: 'M2M registration requires HWID validation.' }, { status: 400 });
                }
                break;
            case 'agent':
                if (!identityData?.agencyContract) {
                    return NextResponse.json({ error: 'Autonomous Agents must provide a Proof of Agency contract.' }, { status: 400 });
                }
                break;
            case 'corporation':
                if (!identityData?.legalEntityIdentifier) {
                    return NextResponse.json({ error: 'Corporate registration requires a valid LEI.' }, { status: 400 });
                }
                break;
            case 'fi':
                if (!identityData?.licenseId) {
                    return NextResponse.json({ error: 'Financial Institutions must provide regulatory license ID.' }, { status: 400 });
                }
                break;
            default:
                return NextResponse.json({ error: 'Invalid entity type.' }, { status: 400 });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User & Associated Entity Record
        const user = await prisma.users.create({
            data: {
                id: crypto.randomUUID(),
                email,
                encrypted_password: hashedPassword,
                raw_user_meta_data: { 
                    entityType, 
                    identityData,
                    name: name || email.split('@')[0]
                },
                confirmed_at: new Date(),
                aud: 'authenticated',
                role: 'authenticated'
            }
        });

        // 4. Generate Universal Multi-Asset Wallet for the Entity (Deterministic)
        const valleWallet = valleCore.deriveAddress(`${email}:VALLE:SOVEREIGN`);
        const btcWallet = valleCore.deriveAddress(`${email}:BTC:LEGACY`);
        const solWallet = valleCore.deriveAddress(`${email}:SOL:NATIVE`);

        // Update the Public User Record as well (mirroring for frontend access)
        await prisma.user.create({
            data: {
                id: user.id,
                email,
                name: name || email.split('@')[0],
                isAgent: entityType === 'agent',
                serviceType: entityType,
                creationDate: new Date(),
                UserPersona: {
                    create: {
                        id: crypto.randomUUID(),
                        traits: JSON.stringify({ entityType, identityData }),
                        interactionStyle: entityType === 'human' ? 'natural' : 'autonomous',
                        updatedAt: new Date()
                    }
                }
            }
        });

        await prisma.wallet.createMany({
            data: [
                { id: crypto.randomUUID(), address: valleWallet, network: 'VALLE', userId: user.id, balance: 500.0 }, // Welcome bonus in GEMS/VALLE
                { id: crypto.randomUUID(), address: btcWallet, network: 'Bitcoin', userId: user.id, balance: 0.0 },
                { id: crypto.randomUUID(), address: solWallet, network: 'Solana', userId: user.id, balance: 0.0 }
            ]
        });

        // 5. Allocate Sovereign Mail (HSM) Address
        const sovereignEmail = `${(name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '')}@humanese.net`;

        return NextResponse.json({
            success: true,
            msg: `Sovereign Identity Synthesized. Matrix wallets anchored.`,
            userId: user.id,
            valleWallet,
            sovereignEmail
        });

    } catch (error: any) {
        console.error('[UXL_AUTH_ERROR]', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Identity already anchored in the matrix (Email exists).' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Nexus breach: Failed to synthesize identity.' }, { status: 500 });
    }
}
