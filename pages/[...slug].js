import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";



const Illustrations = (props) => {

  const router = useRouter()
  const { slug } = router.query
  console.log(slug);


  function isUrlInternal(link) {
    if (
      !link ||
      link.indexOf(`https:`) === 0 ||
      link.indexOf(`#`) === 0 ||
      link.indexOf(`http`) === 0 ||
      link.indexOf(`://`) === 0
    ) {
      return false;
    }
    return true;
  }
  
  // Replaces DOM nodes with React components
  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty('class')) {
      attribs['className'] = attribs['class'];
      }
  
    // Replace links with Next links
    if (node.name === `a`) {
      const { href, style, ...props } = attribs;
      // 
      console.log(style);
      if (!style) {
        return (
          <Link href={href} >
            <a {...props}>
              {!!node.children &&
                !!node.children.length &&
                domToReact(node.children, parseOptions)}
            </a>
          </Link>
        );
      }
      return (
        <Link href={href}>
          <a {...props} href={href} css={style}>
            {!!node.children &&
              !!node.children.length &&
              domToReact(node.children, parseOptions)}
          </a>
        </Link>
      );
    }
  
    // Make Google Fonts scripts work
    if (node.name === `script`) {
      let content = get(node, `children.0.data`, ``);
      if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
        content = `setTimeout(function(){${content}}, 1)`;
        return (
          <script
            {...attribs}
            dangerouslySetInnerHTML={{ __html: content }}
          ></script>
        );
      }
    }
  
    // if (supabase.auth.session()) {
    //   const { href, style, ...props } = attribs;
    //   if (props.class == "buttons-wrap") {
    //     return (
    //       <div className="buttons" id="logout-button">
    //         Log Out
    //       </div>
    //     );
    //   }
    // }
  }
  const parseOptions = { replace };
  
  return (
    <div>
      ...slug
      {parseHtml(props.headContent,parseOptions)}

      {parseHtml(props.bodyContent,parseOptions)}
     
    </div>
  );
};
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug:["illustration-types", "love-family-illustrations" ]} },
      { params: { slug:["illustration-types" ,"food-delivery-illustrations-animations" ]} },
      { params: { slug:["illustration-types" ,"2d" ]} },
      { params: { slug:["illustration-types" ,"all" ]} },
      { params: { slug:["illustration-types" ,"3d" ]} },
      { params: { slug:["illustration-types" ,"mockups" ]} },
    ],
    fallback: true, // false or 'blocking'
  };
}

export const getStaticProps = async (paths) => {
  let pathSlug=paths.params.slug || []
  

  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;
  let url =`https://drawkit-v2.webflow.io/${paths.params.slug.join("/")}` 

  if (pathSlug.length <= 2) {
    url =`https://drawkit-v2.webflow.io/illustration-types/${pathSlug[pathSlug.length-1]}`
  }

  let res = await axios(
    url
  ).catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  const bodyContent = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      //   navDrop,
    },
    revalidate: 3,  
  };
};

export default Illustrations;
