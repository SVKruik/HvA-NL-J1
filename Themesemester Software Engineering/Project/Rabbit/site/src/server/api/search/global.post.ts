import { MeiliSearch } from "meilisearch";
import type { SearchResponse as RawSearchResponse } from "meilisearch";
import { SearchResponse } from "~/assets/customTypes";
import { z } from "zod";
import { searchEngine, searchIndices } from "~/server/core/dsi/searchEngine";
import { formatApiError } from "~/utils/format";

// Validation schema for the request body
const bodySchema = z.object({
    query: z.string().min(1),
    limit: z.number().default(20),
});

/**
 * Search through all available indices.
 */
export default defineEventHandler(async (event): Promise<SearchResponse> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { query, limit } = parseResult.data;
        const search: MeiliSearch = await searchEngine();

        // Multi-search across all indices 
        const response: RawSearchResponse = await search.multiSearch({
            "federation": {
                "limit": limit,
            },
            "queries": searchIndices.map((index) => ({
                "indexUid": index,
                "q": query,
            }))
        });

        return {
            "results": response.hits,
            "count": response.estimatedTotalHits || 0,
            "duration": response.processingTimeMs,
        } as SearchResponse;
    } catch (error: any) {
        throw formatApiError(error);
    }
});