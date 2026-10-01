// File generated from our OpenAPI spec by Castiron. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { multipartFormRequestOptions } from "../internal/uploads.mjs";
function resolveResourceRequestOptions(options, buildOptions) {
    return Promise.resolve(options).then(buildOptions);
}
/**
 * Given a prompt and/or an input image, the model will generate a new image.
 */
export class Images extends APIResource {
    /**
     * Creates a variation of a given image. This endpoint only supports `dall-e-2`.
     *
     * @example
     * ```ts
     * const imagesResponse = await client.images.createVariation({
     *   image: fs.createReadStream('otter.png'),
     * });
     * ```
     */
    createVariation(body, options) {
        return this._client.post('/images/variations', resolveResourceRequestOptions(options, (options) => multipartFormRequestOptions({ body, ...options, __security: { bearerAuth: true } }, this._client)));
    }
    edit(body, options) {
        return this._client.post('/images/edits', resolveResourceRequestOptions(options, (options) => multipartFormRequestOptions({
            body,
            ...options,
            stream: body.stream ?? false,
            __metadata: { ...options?.__metadata, ...(body.model == null ? {} : { model: body.model }) },
            __security: { bearerAuth: true },
        }, this._client)));
    }
    generate(body, options) {
        return this._client.post('/images/generations', resolveResourceRequestOptions(options, (options) => ({
            body,
            ...options,
            stream: body.stream ?? false,
            __security: { bearerAuth: true },
        })));
    }
}
//# sourceMappingURL=images.mjs.map