function getNamedImportSpecifierText(sourceCode, specifier) {
  const importedText = sourceCode.getText(specifier.imported);
  const localText = sourceCode.getText(specifier.local);

  if (importedText === localText) {
    return importedText;
  }

  return `${importedText} as ${localText}`;
}

function buildNamedImports(specifierTexts) {
  return `{ ${specifierTexts.join(", ")} }`;
}

function canFixImportDeclaration(sourceCode, node) {
  const tailText = sourceCode.text.slice(node.source.range[1], node.range[1]);
  const normalizedTailText = tailText.replace(/;\s*$/, "").trim();

  return normalizedTailText.length === 0;
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "要求类型导入使用独立的 import type 语句",
    },
    fixable: "code",
    schema: [],
    messages: {
      separateTypeImports: "类型导入请使用独立的 import type 语句，不要和运行时导入混写。",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ImportDeclaration(node) {
        if (node.importKind !== "value") {
          return;
        }

        const inlineTypeSpecifiers = node.specifiers.filter(
          (specifier) => specifier.type === "ImportSpecifier" && specifier.importKind === "type",
        );

        if (inlineTypeSpecifiers.length === 0) {
          return;
        }

        context.report({
          node,
          messageId: "separateTypeImports",
          fix: canFixImportDeclaration(sourceCode, node)
            ? (fixer) => {
                const defaultSpecifier = node.specifiers.find(
                  (specifier) => specifier.type === "ImportDefaultSpecifier",
                );
                const namespaceSpecifier = node.specifiers.find(
                  (specifier) => specifier.type === "ImportNamespaceSpecifier",
                );
                const valueNamedSpecifiers = node.specifiers.filter(
                  (specifier) =>
                    specifier.type === "ImportSpecifier" && specifier.importKind !== "type",
                );
                const sourceText = sourceCode.getText(node.source);

                const typeImportText = `import type ${buildNamedImports(
                  inlineTypeSpecifiers.map((specifier) =>
                    getNamedImportSpecifierText(sourceCode, specifier),
                  ),
                )} from ${sourceText};`;

                const valueImportParts = [];

                if (defaultSpecifier) {
                  valueImportParts.push(sourceCode.getText(defaultSpecifier));
                }

                if (namespaceSpecifier) {
                  valueImportParts.push(sourceCode.getText(namespaceSpecifier));
                }

                if (valueNamedSpecifiers.length > 0) {
                  valueImportParts.push(
                    buildNamedImports(
                      valueNamedSpecifiers.map((specifier) =>
                        getNamedImportSpecifierText(sourceCode, specifier),
                      ),
                    ),
                  );
                }

                const replacementText =
                  valueImportParts.length > 0
                    ? `${typeImportText}\nimport ${valueImportParts.join(", ")} from ${sourceText};`
                    : typeImportText;

                return fixer.replaceText(node, replacementText);
              }
            : null,
        });
      },
    };
  },
};
