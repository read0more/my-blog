"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[989],{8771:function(e,t,a){var l=a(7294),n=a(1883);t.Z=()=>{var e,t;const a=(0,n.useStaticQuery)("2630815655"),r=null===(e=a.site.siteMetadata)||void 0===e?void 0:e.author;null===(t=a.site.siteMetadata)||void 0===t||t.social;return l.createElement("div",{className:"bio"},(null==r?void 0:r.name)&&l.createElement("p",null,l.createElement("strong",null,(null==r?void 0:r.summary)||null),l.createElement("p",null,a.site.siteMetadata.description)))}},8678:function(e,t,a){var l=a(7294),n=a(1883);t.Z=e=>{let{location:t,title:a,children:r}=e;const i="/"===t.pathname;let c;return c=i?l.createElement("h1",{className:"main-heading"},l.createElement(n.Link,{to:"/"},a)):l.createElement(n.Link,{className:"header-link-home",to:"/"},a),l.createElement("div",{className:"global-wrapper","data-is-root-path":i},l.createElement("header",{className:"global-header"},c),l.createElement("main",null,r),l.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",l.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))}},9357:function(e,t,a){var l=a(7294),n=a(1883);t.Z=e=>{var t,a,r;let{description:i,title:c,children:o}=e;const{site:m}=(0,n.useStaticQuery)("2841359383"),s=i||m.siteMetadata.description,d=null===(t=m.siteMetadata)||void 0===t?void 0:t.title;return l.createElement(l.Fragment,null,l.createElement("title",null,d?c+" | "+d:c),l.createElement("meta",{name:"description",content:s}),l.createElement("meta",{property:"og:title",content:c}),l.createElement("meta",{property:"og:description",content:s}),l.createElement("meta",{property:"og:type",content:"website"}),l.createElement("meta",{name:"twitter:card",content:"summary"}),l.createElement("meta",{name:"twitter:creator",content:(null===(a=m.siteMetadata)||void 0===a||null===(r=a.social)||void 0===r?void 0:r.twitter)||""}),l.createElement("meta",{name:"twitter:title",content:c}),l.createElement("meta",{name:"twitter:description",content:s}),o)}},4982:function(e,t,a){a.r(t),a.d(t,{Head:function(){return o}});var l=a(7294),n=a(1883),r=a(8771),i=a(8678),c=a(9357);const o=e=>{let{data:{markdownRemark:t}}=e;return l.createElement(c.Z,{title:t.frontmatter.title,description:t.frontmatter.description||t.excerpt})};t.default=e=>{var t;let{data:{previous:a,next:c,site:o,markdownRemark:m},location:s}=e;const d=(null===(t=o.siteMetadata)||void 0===t?void 0:t.title)||"Title";return l.createElement(i.Z,{location:s,title:d},l.createElement("article",{className:"blog-post",itemScope:!0,itemType:"http://schema.org/Article"},l.createElement("header",null,l.createElement("h1",{itemProp:"headline"},m.frontmatter.title),l.createElement("p",null,m.frontmatter.date)),l.createElement("section",{dangerouslySetInnerHTML:{__html:m.html},itemProp:"articleBody"}),l.createElement("hr",null),l.createElement("footer",null,l.createElement(r.Z,null))),l.createElement("nav",{className:"blog-post-nav"},l.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},l.createElement("li",null,a&&l.createElement(n.Link,{to:a.fields.slug,rel:"prev"},"← ",a.frontmatter.title)),l.createElement("li",null,c&&l.createElement(n.Link,{to:c.fields.slug,rel:"next"},c.frontmatter.title," →")))))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-d1e65f368a217fcd3fe0.js.map