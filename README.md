# Facial Feature Art
Marisa Wodrich

This repository contains all the code I wrote for my Bachelor's thesis. 

## Interactive website 
* link to the website: https://marisawodrich.github.io/portrait-playground/
* link to the website: https://marisawodrich.github.io/facial-feature-art/
* On the website, the user can create an abstract portrait. For that, they can choose between several images, how many lines the portrait will have, how thick those lines are, how long they can be and the color of them. The user can push a button to start the drawing process.

## code structure
### preprocessing.ipynb
* contains all steps for preprocessing images. This includes
  * Facial Feature Detection
  * Application of Filters and Image Gradients
  * Facial Feature Extraction
  
### figures.ipynb
* used for producing figures for the thesis

### index.html file
* contains the different elements for the website and how they are structured
  * there is a header, a canvas element, 3 select-from-options buttons, one input (type in) button, a color chooser button and a simple push button
### canvas.js file
* contains the canvas elements and the main algorithm which computes how to draw the portrait
* contains all the actions (what happens to the program when the user changes something with the buttons)
### styles.css file
* contains the styles for the different elements the website has
 
## other files 
* in the folder "images" you can find the images that are used for the website

