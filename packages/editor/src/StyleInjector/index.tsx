import React from "react";

interface StyleInjectorProps {
  css: string;
}

// dangerouslySetInnerHTML is required here because CSS attribute selectors
// contain double quotes (e.g. [data-value="..."]) that React would escape
// to &quot; when rendering a <style> tag via text children, breaking the CSS.
//
// This is safe: `css` is a build-time constant generated from our own source
// files — it is never derived from props or user input, so there is no XSS risk.
//
// React 19 solves this cleanly with <style precedence="...">{css}</style>,
// which hoists the tag to <head> and deduplicates across instances. However,
// React 18 still holds ~65% (May 2026) of npm downloads and React 19 adoption is
// projected to reach plurality no sooner than 2029–2033. Requiring React 19 as a
// peer dependency would be premature for a general-purpose package.
export function StyleInjector({ css }: StyleInjectorProps): React.ReactElement {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}