import { prop } from "cheerio/lib/api/attributes";
import parseHtml, { domToReact } from "html-react-parser";
import React,{ useState } from "react";
import MainWrapper from "./mainwrapper";
import get from 'lodash/get';
import Link from "next/link";

function isUrlInternal(link){
    if(
      !link ||
      link.indexOf(`https:`) === 0 ||
      link.indexOf(`#`) === 0 ||
      link.indexOf(`http`) === 0 ||
      link.indexOf(`://`) === 0
    ){
      return false
    }
    return true
  }
  
  // Replaces DOM nodes with React components
  function replace(node){
    const attribs = node.attribs || {}
  
    // Replace links with Next links
    if(node.name === `a`  ){
        console.log(node);
      const { href, style, ...props } = attribs
      if(props.class){
        props.className = props.class
        delete props.class
      }
      if(!style || true ){
        return (
          <Link href={href}>
            <a {...props}>
              {!!node.children && !!node.children.length &&
                domToReact(node.children, parseOptions)
              }
            </a>
          </Link>
        )
      }
      return (
        <Link href={href}>
          <a {...props} href={href} css={style}>
            {!!node.children && !!node.children.length &&
              domToReact(node.children, parseOptions)
            }
          </a>
        </Link>
      )
    }
  
  
    // Make Google Fonts scripts work
    if(node.name === `script`){
      let content = get(node, `children.0.data`, ``)
      if(content && content.trim().indexOf(`WebFont.load(`) === 0){
        content = `setTimeout(function(){${content}}, 1)`
        return (
          <script {...attribs} dangerouslySetInnerHTML={{__html: content}}></script>
        )
      }
    }
  
  }
  const parseOptions = { replace }

export default function Home(props) {
    let [navBar,setnavbar] = useState(props.navBar)
    let [headContent,setheadContent] = useState(props.headContent)
    let [mainWrap,setmainWrap] = useState(props.mainWrap);
  return (
    <>
      {parseHtml(headContent,parseOptions)}
      {parseHtml(navBar,parseOptions)}
      <MainWrapper mainWrap={mainWrap}/>
      {parseHtml(props.supportScripts,parseOptions)}
      
    </>
  );
}

/** data fetching  from w-drawkit site*/
export async function getStaticProps() {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

  const supportScripts = Object.keys($(`script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    })
    .map((m) => `<script type="text/javascript" src="${m}"></script>`)
    .join("")
    .toString();

  const navBar = $(`.navbar`).html();
  const mainWrap = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();

  return {
    props: {
      headContent: headContent,
      supportScripts: supportScripts,
      navBar: navBar,
      mainWrap: mainWrap,
    },
  };
}
