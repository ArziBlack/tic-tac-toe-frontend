function addGlobalEventListener(type, selector, callback, options) {
    document.addEventListener(
      type,
      e => {
        if (e.target.matches(selector)) callback(e)
      },
      options
    )
  }
  
  addGlobalEventListener(
    "click",
    ".btn",
    () => {
      console.log("Clicked Button")
    },
    { once: true }
  )