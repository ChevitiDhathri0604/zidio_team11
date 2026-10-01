"use strict";
// File generated from our OpenAPI spec by Castiron. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeys = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
function resolveResourceRequestOptions(options, buildOptions) {
    return Promise.resolve(options).then(buildOptions);
}
// Recognizable options across SDK runtime versions. Keep this independent of
// private RequestOptions fields so older handwritten runtimes still compile.
const normalizeRequestOptionsForQueryKeys = new Set([
    'method',
    'path',
    'query',
    'body',
    'headers',
    'maxRetries',
    'stream',
    'timeout',
    'httpAgent',
    'fetchOptions',
    'signal',
    'idempotencyKey',
    'defaultBaseURL',
    '__metadata',
    '__binaryRequest',
    '__binaryResponse',
    '__streamClass',
    '__security',
    '__synthesizeEventData',
]);
function normalizeRequestOptionsForQuery(value, queryKeys, options) {
    if (typeof value !== 'object' || value === null)
        return undefined;
    // Optional never fields can still be explicitly undefined unless consumers
    // enable exactOptionalPropertyTypes. Snapshot data without invoking getters.
    const entries = Object.entries(Object.getOwnPropertyDescriptors(value)).filter(([, descriptor]) => descriptor.enumerable && (!('value' in descriptor) || descriptor.value !== undefined));
    const keys = entries.map(([key]) => key);
    const requestOnly = keys.some((key) => normalizeRequestOptionsForQueryKeys.has(key) && !queryKeys.includes(key));
    if (!requestOnly)
        return undefined;
    // Declared query fields, including stream, must use the query argument.
    // Mixing them with request-only options is ambiguous and could change the return type.
    if (options !== undefined ||
        keys.some((key) => !normalizeRequestOptionsForQueryKeys.has(key) || queryKeys.includes(key))) {
        throw new TypeError('Query parameters and request options must be passed as separate arguments.');
    }
    // The query position must not gain authority to change the request destination
    // or transport. Those overrides require the explicit request options argument.
    if (keys.some((key) => !['headers', 'maxRetries', 'timeout', 'signal', 'idempotencyKey', 'query'].includes(key))) {
        throw new TypeError('Pass transport overrides in the explicit request options argument.');
    }
    // Copy only the validated fields. Spreading value would reintroduce undefined
    // transport overrides, and deleting them would mutate the caller's object.
    return Object.fromEntries(entries.map(([key, descriptor]) => {
        if ('value' in descriptor)
            return [key, descriptor.value];
        return [key, descriptor.get ? Reflect.apply(descriptor.get, value, []) : undefined];
    }));
}
class APIKeys extends resource_1.APIResource {
    /**
     * Retrieves an API key in the project.
     *
     * @example
     * ```ts
     * const projectAPIKey =
     *   await client.admin.organization.projects.apiKeys.retrieve(
     *     'api_key_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    retrieve(apiKeyID, params, options) {
        const { project_id } = params;
        return this._client.get((0, path_1.path) `/organization/projects/${project_id}/api_keys/${apiKeyID}`, resolveResourceRequestOptions(options, (options) => ({
            ...options,
            __security: { adminAPIKeyAuth: true },
        })));
    }
    list(projectID, query = {}, options) {
        const normalizeRequestOptionsForQueryOptions = normalizeRequestOptionsForQuery(query, ['after', 'limit', 'owner_project_access'], options);
        if (normalizeRequestOptionsForQueryOptions !== undefined) {
            options = normalizeRequestOptionsForQueryOptions;
            query = {};
        }
        query = query;
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/api_keys`, (pagination_1.ConversationCursorPage), resolveResourceRequestOptions(options, (options) => ({
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        })));
    }
    /**
     * Deletes an API key from the project.
     *
     * Returns confirmation of the key deletion, or an error if the key belonged to a
     * service account.
     *
     * @example
     * ```ts
     * const apiKey =
     *   await client.admin.organization.projects.apiKeys.delete(
     *     'api_key_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(apiKeyID, params, options) {
        const { project_id } = params;
        return this._client.delete((0, path_1.path) `/organization/projects/${project_id}/api_keys/${apiKeyID}`, resolveResourceRequestOptions(options, (options) => ({
            ...options,
            __security: { adminAPIKeyAuth: true },
        })));
    }
}
exports.APIKeys = APIKeys;
//# sourceMappingURL=api-keys.js.map