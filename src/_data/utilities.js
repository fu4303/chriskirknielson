module.exports = { // Define a list of utility classes that are commonly used together to form a basic component/object
    // Block formatting context
    bfc : "u-bfc",
    
    // Global link with box hover effect
    boxLink: "u-fontBold u-textDecoration--none u-border--double u-border--accent u-bg--grey-max h:u-c--grey-max h:u-bg--accent",
    glowBoxLink: "u-fontBold h:u-c--grey-min h:u-bg--grey-max u-border u-border--transparent h:u-border--accent u-border-radius h:u-glowBox--accent h:u-textShadow--currentBg",
    flexBoxLink: "u-displayInlineFlex u-flex--centerBlock u-padding u-border-radius",

    // Card component
    cardFlex: "u-flex--grow-1 u-flex--basis-0",
    cardContainer: "u-margin--flexGap-double u-marginBlockStart--none md:u-displayFlex",
    cardBox: "u-padding u-c--text-color u-bg--grey-max u-border u-border--grey-med u-border-radius",
    cardBoxLink: "h:u-border--accent h:u-glowBox--accent",
    
    // Callout block
    callout: "u-posRelative u-paddingInline u-paddingBlockStart--double u-paddingBlockEnd",

    // Hero component
    bigboi: "bigboi content-full content-sub u-posRelative u-paddingBlock--double u-bg--grey-max u-beforeCover u-afterCover",
    bigboiContent: "bigboi-content u-posRelative u-zIndex--1 u-content",
}