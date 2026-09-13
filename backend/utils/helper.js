function uniquename(image) {
  return Date.now() + "-" + image.replace(/\s+/g, "_");
}

module.exports ={uniquename}