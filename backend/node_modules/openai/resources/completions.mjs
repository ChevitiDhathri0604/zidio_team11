// File generated from our OpenAPI spec by Castiron. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
function resolveResourceRequestOptions(options, buildOptions) {
    return Promise.resolve(options).then(buildOptions);
}
/**
 * Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each position.
 */
export class Completions extends APIResource {
    create(body, options) {
        return this._client.post('/completions', resolveResourceRequestOptions(options, (options) => ({
            body,
            ...options,
            stream: body.stream ?? false,
            __security: { bearerAuth: true },
        })));
    }
}
//# sourceMappingURL=completions.mjs.map