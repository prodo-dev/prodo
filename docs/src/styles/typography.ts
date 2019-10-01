import Typography from "typography";
import CodePlugin from "typography-plugin-code";
import githubTheme from "typography-theme-github";

const typography = new Typography({
  ...githubTheme,
  plugins: new CodePlugin(),
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
