import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

type SanityImageSource = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
