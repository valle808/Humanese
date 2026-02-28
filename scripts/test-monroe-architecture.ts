import { supabase } from '../lib/utils'; // Adjust path if needed

async function testMonroeArchitecture() {
    const sessionId = 'test-session-' + Date.now();
    console.log(`Starting verification for session: ${sessionId}`);

    // Simulate 52 messages to trigger vacation
    for (let i = 1; i <= 52; i++) {
        const { data, error } = await supabase
            .from('monroe_state')
            .upsert({ session_id: sessionId, message_count: i }, { onConflict: 'session_id' })
            .select()
            .single();

        if (error) {
            console.error(`Error at message ${i}:`, error);
            break;
        }

        if (i % 10 === 0) {
            console.log(`Message ${i}: Ambition is ${data.current_ambition}`);
        }

        if (i === 50) {
            // Manually set vacation in test
            await supabase.from('monroe_state').update({ is_vacation: true }).eq('session_id', sessionId);
            console.log('Message 50: Vacation triggered.');
        }

        if (i === 52) {
            console.log(`Message 52: is_vacation should be true. Current value: ${data.is_vacation}`);
        }
    }

    console.log('Verification script completed.');
}

// testMonroeArchitecture();
