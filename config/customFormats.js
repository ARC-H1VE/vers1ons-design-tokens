import { minifyDictionary, fileHeader } from "style-dictionary/utils";

export default {
  javascriptCustomNestedObjects: {
    name: 'javascript/custom',
    format: async ({ dictionary, file }) => {
      // text to camel case converter
      const keyToCamel = key =>
        key.replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => {
          if (p2) return p2.toUpperCase();
          return p1.toLowerCase();
        });

      // function to recursively traverse object and run the camel case converter
      const formatKeys = object => {
        // stop at lowest level when the value key exists
        if (Object.keys(object).includes('value')) return object;

        const formatedLayer = Object.entries(object).reduce(
          (updateDict, [key, value]) => {
            const formatedObject = formatKeys(value);
            const formatedKey = keyToCamel(key);
            return {
              ...updateDict,
              [formatedKey]: formatedObject,
            };
          },
          {},
        );

        return formatedLayer;
      };

      // traverse object and run the camel case converter
      const formatedKeys = formatKeys(dictionary.tokens);

      const fileHead = await fileHeader({
        file,
        commentStyle: 'short',
      });

      return `${fileHead}const tokens = ${JSON.stringify(
        minifyDictionary(formatedKeys),
        null,
        2,
      )};
        export default tokens;`;
    },
  }
};