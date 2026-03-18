import { grokipedia } from './grokipedia';

/**
 * Comparison Engine
 * Transmutated from Parallelpedia's comparison.py logic.
 */

export enum SegmentLabel {
    ALIGNED = 'aligned',
    CONFLICT = 'conflict',
    MISSING_CONTEXT = 'missing_context',
    UNSUPPORTED = 'unsupported'
}

export interface ComparisonResult {
    trust_score: number;
    summary: string;
    segments: {
        text: string;
        label: SegmentLabel;
        similarity: number;
        issues: string[];
    }[];
}

export class ComparisonService {
    /**
     * Calculate Cosine Similarity between two vectors
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magA * magB);
    }

    /**
     * Jaccard Similarity for entity comparison
     */
    private jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
        const arrA = Array.from(setA);
        const arrB = Array.from(setB);
        const intersection = new Set(arrA.filter(x => setB.has(x)));
        const union = new Set([...arrA, ...arrB]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    }

    /**
     * Extract basic dates from text
     */
    private extractDates(text: string): string[] {
        const yearPattern = /\b(19|20)\d{2}\b/g;
        return text.match(yearPattern) || [];
    }

    /**
     * Compare two texts and generate an analysis
     */
    async compare(sourceText: string, targetText: string): Promise<ComparisonResult> {
        const sourceSegments = sourceText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);

        const results = sourceSegments.map(segment => {
            const similarity = 0.5; // Placeholder
            const issues: string[] = [];
            let label = SegmentLabel.MISSING_CONTEXT;

            if (similarity > 0.8) label = SegmentLabel.ALIGNED;
            else if (similarity < 0.2) label = SegmentLabel.UNSUPPORTED;

            return {
                text: segment,
                label,
                similarity,
                issues
            };
        });

        const trust_score = this.calculateTrustScore(results);

        return {
            trust_score,
            summary: `Analysis complete. Trust score: ${trust_score.toFixed(1)}%`,
            segments: results
        };
    }

    private calculateTrustScore(segments: any[]): number {
        const weights: Record<string, number> = {
            [SegmentLabel.ALIGNED]: 1.0,
            [SegmentLabel.MISSING_CONTEXT]: 0.6,
            [SegmentLabel.CONFLICT]: -0.5,
            [SegmentLabel.UNSUPPORTED]: 0.3
        };

        let totalScore = 0;
        segments.forEach(seg => {
            totalScore += (weights[seg.label] || 0) * seg.similarity;
        });

        const normalized = (totalScore / segments.length) * 100;
        return Math.max(0, Math.min(100, normalized));
    }
}

export const comparison = new ComparisonService();
