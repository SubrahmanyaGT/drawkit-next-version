import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";
export default function MainWrapper(props) {
  return <>{props.mainWrap}</>;
}
