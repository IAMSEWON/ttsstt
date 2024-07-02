module.exports = {
  root: true,
  extends: ['@react-native', "airbnb",
    "airbnb-typescript",

    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"],

  "plugins": [
    "simple-import-sort/imports",
    "unused-imports",
    "@typescript-eslint",
    "simple-import-sort",
    "prettier" // Prettier 플러그인을 ESLint에 추가합니다.
  ],
  "parser": "@typescript-eslint/parser", // TypeScript 코드를 파싱하기 위해 사용합니다.
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "no-var": "error", // var 금지
    "react/require-default-props":"off", // default props 필수 제거
    "prettier/prettier": "error", // Prettier 규칙 위반을 ESLint 오류로 처리합니다.
    "no-console": "warn", // 콘솔 로그 사용 시 경고를 표시합니다.
    "func-names": "off", // 익명 함수에 대한 제한을 비활성화합니다.
    "unused-imports/no-unused-imports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          // Packages `react` related packages come first.
          ["^react", "^@?\\w"],
          // Internal packages.
          ["^(@|components)(/.*|$)"],
          // Side effect imports.
          ["^\\u0000"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // Style imports.
          ["^.+\\.?(css)$"]
        ]
      }
    ]
  }
};


