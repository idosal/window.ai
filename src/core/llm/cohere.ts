import { Model, ModelConfig, RequestOptions } from "./model"

export enum CohereModelId {
  XlargeNightly = "command-xlarge-nightly",
  Xlarge = "xlarge",
  Medium = "medium"
}

// export const CohereModels = {
//   [CohereModelId.XlargeNightly]: {
//     contextLimit: 2048
//   },
//   [CohereModelId.Xlarge]: {
//     contextLimit: 2048
//   },
//   [CohereModelId.Medium]: {
//     contextLimit: 2048
//   }
// }

export function init(
  config: Pick<ModelConfig, "quality" | "debug"> &
    Partial<Pick<ModelConfig, "cacheGet" | "cacheSet">>,
  options: RequestOptions
) {
  const modelId =
    config.quality === "low"
      ? CohereModelId.Xlarge
      : CohereModelId.XlargeNightly
  return new Model(
    {
      ...config,
      modelProvider: "cohere",
      baseUrl: "https://api.cohere.ai",
      getPath: () => "/generate",
      authPrefix: "BEARER ",
      getModelId: () => modelId,
      debug: config.debug,
      customHeaders: {
        "Cohere-Version": "2022-12-06"
      },
      transformForRequest: (req) => {
        const {
          modelId,
          prompt,
          messages,
          top_p,
          modelProvider,
          stop_sequences,
          ...optsToSend
        } = req
        const fullPrompt =
          prompt !== undefined
            ? `<human>: ${prompt}`
            : messages
                ?.map(
                  (m) =>
                    `${m.role === "user" ? "<human>" : "<bot>"}: ${m.content}`
                )
                .join("\n")
        return {
          ...optsToSend,
          stop_sequences: ["\n<human>", ...stop_sequences],
          prompt: fullPrompt + "\n<bot>: ",
          model: modelId,
          p: top_p
        }
      },
      transformResponse: (res) => {
        const anyRes = res as any
        return anyRes["generations"]
          ? anyRes["generations"][0]["text"]
          : anyRes["text"]
          ? anyRes["text"]
          : null
      }
    },
    options
  )
}
