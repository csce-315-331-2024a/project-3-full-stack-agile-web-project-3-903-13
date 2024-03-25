# Back-End Overview
The back-end for this project is structured as follows:
- Config
    - Configurations for the database and any other configuration data we may need as the project progresses
- Routes
    - Contains scripts that route requests according to the resource they are directed towards (menu items, employees, transactions, etc.)
- Services
    - Contains scripts that interact with the database through queries, fulfilling requests that are caught by the various routers
 
At the top level, index.js is the entry point for the server application. This contains the code that sets up an ExpressJS server, assigns routers 
to their corresponding URLS, and initiates a database connection.

# API Development Workflow
The following serves as a guideline for developing full-stack features for this project, with an emphasis on the server-side code. This in no way serves as a strict guideline, but rather a suggestion based on the initial folder structure of the back-end code in the repository.
1) Determine the resource being requested/modified/deleted/created (e.g. menu items, employees, transactions, etc.)
   
2) Navigate to the JavaScript file corresponding to the resource within the routes directory. Determine the location of the api endpoint and the request method that will be used for your use-case.
    -  For example, if I want to create an endpoint that allows users to delete the database entry for a menu item given the item's ID, I would create an endpoint with "router.delete", passing in the route "/:id".
      
3) Create a function within the appropriate JavaScript file in the services directory to handle the database interaction that corresponds to your feature. This function will be registered as the callback function in the router method that you created for step 2.
    -  Continuing with our example from step 2, I would write the "deleteItemById" function in menuItems.js in the services directory, which would execute the appropriate SQL query to delete the item from the database. I would then add this function to the export list (see the bottom of the file), which would allow me to use this function in other files in the backend project. Back in the menuItems.js file in the routes directory, I would then register this function as the callback for the corresponding router method. (i.e. router.delete("/menuitems/:id", menuItemsController.deleteItemById))
  
# Resources
- Introduction to REST APIs: https://youtu.be/-MTSQjw5DrM?si=8vFx9irdwrqYWhe1
- Test API calls without needing a frontend, using Insomnia: https://insomnia.rest/
- Basics of HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP (PLEASE READ)
  
Please update this list with any helpful back-end resources you may come across.
