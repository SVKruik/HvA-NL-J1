import { MeiliSearch } from "meilisearch";
import type { SearchResponse as RawSearchResponse } from "meilisearch";
import { SearchResponse } from "~/assets/customTypes";
import { z } from "zod";
import { isValidIndex, searchEngine } from "~/server/core/dsi/searchEngine";
import { formatApiError } from "~/utils/format";

// Validation schema for the request body
const bodySchema = z.object({
    query: z.string().min(1),
    scope: z.array(z.string()),
    offset: z.number().default(0),
    limit: z.number().default(20),
});

/**
 * Search a specific part(s) of the site.
 */
export default defineEventHandler(async (event): Promise<SearchResponse> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { query, scope, offset, limit } = parseResult.data;
        if (!isValidIndex(scope)) throw new Error("Invalid search scope.", { cause: { statusCode: 1400 } });
        const search: MeiliSearch = await searchEngine();

        // Multi-search across specified indices
        const response: RawSearchResponse = await search.multiSearch({
            "federation": {
                "limit": limit,
                "offset": offset,
            },
            "queries": scope.map((indexName: string) => ({
                "indexUid": indexName,
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