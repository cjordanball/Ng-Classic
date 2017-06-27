# Ng Classic

[toc]

## What is Angular Trying to Solve

1. The key purpose of Angular (or NgClassic) is to manage the DOM through JavaScript, without having to update everything manually.

2. The biggest problem with NgClassic is likely the fact that its developers, being really smart guys with lots of formal CS learning, were excessively rigid in applying the CS concepts to the framework documentation, making it ratheer opaque.

3. Throughout this outline, we will highlight terms that are sprinkled throughout the NgClassic documentation; these words should be learned thoroughly in order to understand what is really going on. We will often find that very simple, common-sense concepts are buried under arcane vocabulary.  Some initial vocab:

    a. **Model**: The data.

    b. **View**: What people see.

    c. **Binding**:  Connection between the model and the view.

    There are a number of theoretical approaches to the architecture of a web application, such as **MVC** (model, view, controller). NgClassic is an **MV** structure, with a model, a view, and Angular providing the glue between them.
    
    

## Miscellaneous Concepts

### Custom HTML Attributes

1. Of course, the browser has many built-in attributes that we can add to html tags, such as *style* or *class*, that the browser will recognize and know how to handle. In addition, we can add our own attributes to an html tag, although they will not have any visible effect on the page (as the browser parser will not recognize them). However, they still exist in the memory representation of the DOM.

2. HTML5 has a "recognized" implementation of this, with "data-" attributes.  Angular has a similar approach in marking its custom attributes with the "ng-" prefix. In fact, Angular will recognize the following, HTML5-compliant, notation: *data-ng-taco*.

### Global Namespace

One of the biggest practical problems in creating large JavaScript applications is the fact that, by default, everything gets saved to the global namespace (specifically, to *window* in the browser context). To prevent this, we can use the technique of **encapsulation**, by placing related variables and functions into a single object as properties / methods of that object. NgClassic does a great deal of this.

### Dependency Injection

1. The concept of **dependency injection** is super-simple: instead of creating an object inside a function, one passes in the object as an argument.   As a simple example, compare the following two code snippets:
    ```javascript
    var Person = function(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
    
    function logPerson() {
        var john = new Person('John', 'Doe');
        console.log(john);
    }
    ```
    the function *logPerson()* in the above example is said to be **dependent* on the *john* object because its behaviour is controlled by it. In contrast:
    ```javascript
    var Person = function(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
    
    function logPerson(person) {
        console.log(person);
    }
    
    var john = new Person('John', 'Doe');

    logPerson(john);
    ```
    the function *logPerson( )* is not dependant on the *john* object. It has the same action, but is passed the object as an argument.

2. Although very simple, the idea of *dependency injection* is very important. It allows for code that is much more modular, because changes to the dependency remain separate from the dependent function.

### Functions, Strings & Minification
1. When we create a function in JavaScript, we often will assign parameters to it.

2. If we refer to the function we have created with the parens, then the function will execute, with any side effects, and perhaps returning a value.

3. On the other hand, if we refer to the function *without* the parens, then the function does not execute. We can also run the *toString( )* method on it, which will return a string representation of the function.

4. NgClassic has a method (angular.injector().annotage([a function]) that parses the parameters of a function converted to a string, and inserts the pieces that it recognizes, such as *$scope.*

5. One problem is that if the code is minified, the parameter names will all be changed to "a", "b", "c", . . . To prevent this, NgClassic puts these names into an array as strings, with the final item of the array being the function. These strings will not be minified, and will be placed into the function in the order they are presented in the array.  As an example:
    ```javascript
    app.controller('mainCtlr', ['$scope', 'var1', 'var2', function( a, b, c, d){
 
    }];
    ```
    **Note**: Although it is a convention to name the function parameters the same as the dependencies in the array before the function, it is not necessary.
    
### NgClassic and the Event Loop
1. To understand how NgClassic is working, it is important to understand how javascript is working in connection witht the browswer.

2. JavaScript has running, behind the scenes, an **event loop**, where it is always adding and acting upon events. For example, we can use the method *addEventListener()* to a DOM element and pass to it the event we are listening for, such as a click, a keypress, a mouseover, *etc*.  When the anticipated event occurs, then the **callback function**, or **event handler** is triggered. But JavaScript is always running the event loop, waiting to add events.

3. NgClassic, behind the scenes, is adding event listeners and using the event loop to keep track of things automatically. It adds **watchers** that compare old values to new values to see if anything has changed and needs updating. NgClassic maintains a **watchlist** of the items it is watching.

4. NgClassic makes use of a **Digest Loop** where it is going through its watchlist looking to see if anything has changed. It is a separate loop from the event loop. If it goes through the digest loop and finds any value on the watchlist that has changed, then it will re-render every portion of the DOM that is affected by that change. **And then it runs one more cycle**, to see if the changes made as a result of the original cycle caused any further changes. When it makes a cycle without changes, then it stops until kicked off again by something in the event loop.

5. The *$scope* service has a method, **$watch**, that takes two parameters, the name of the $scope property being watched and a callback with two params, the old val and the new val. This is not ordinarily used, but does give us access to what is going on under the hood.

6. The caveat here is that the digest loop is only looking at things on the watch list, which means only things within the NgClassic context. For example, if we use *setTimeout* (the plain old JavaScript method) instead of the NgClassic service *$timeout*, the watch digest will not be set off. We can fix this in a few ways:

    a. of course, for this example, we simply use the *$timeout* service.
    
    b. use the $scope method, **%apply(). As a parameter, pass in a callback that contains the actions we want to trigger the digest loop:
    ```javascript
    setTimeout(() => {
        $scope.$apply(() => {
            $scope.handle = 'newStringValue';
            console.log('value changed');
        });
    }, 3000);
    ```

7. This is an example of a central issue regarding NgClassic. As long as one stays within the confines of NgClassic, then a great deal is taken care of, behind the scenes. However, if one tries to do something out of context, then it can be very perplexing to figure out exactly what is going on, and then take care of it.


## Starting Up

1. The first thing to do in order to have an angular application is to download angular into the page.  This can be done with a manager such as bower, or by directly loading the angular code from a CDN.  All versions of AngularJS can be found on the Angular webpage.

2. Be sure to \<script> in the JavaScript file **after** importing the AngularJS file, or else the code in the JS file won't recognize Angular.

3. In the HTML page, place the **ng-app="taco"** directive on an upper-level tag, such as the *\<body>* or *\<html>* tag.  This will make the angular module available to all the DOM within these tags.

4. In the JS page, create the angular module by using the *module( )* method of the angular object:
    ```javascript
    const myApp = angular.module('taco', [ ]);
    ```
    **Note**: In the above code, the module is created with the name *taco*, which is what will be recognized by the *ng-app* directive. The *const myApp* is just a handle for referencing the module later.  The brackets are where dependencies will be placed, if necessary, such as *ngRoute*. 

5. Next, we will want to create a **controller**. We can do this by using the *controller()* method of the angular module object. The syntax for the *controller()* method is a bit strange, as follows:
    ```javascript
    const myApp = angular.module('myApp', []);
		
    myApp.controller('myController', ['$scope', function($scope) {
        . . .
    }]);
    ```
    In the above code, the controller is given the name 'myController'. The dependencies to be injected into the controller are placed, in quotes, as the first items in the array, and then are passed into the function in the same order (but the parameters do **not** need to match the quoted names).
	
6. To put the controller into our view, add the **ng-controller** directive as an attribute of the DOM element where we wish to make the controller available. The syntax will be as follows:
    ```html
    <div ng-controller="myController">
        <h1>Goodbye, Cruel World!</h1>
    </div>
    ```
    
## Scope and Interpolation
1. As discussed eleswhere, the **$scope** service applies only to its controller, and is the glue between the controller and the portion of the DOM under its control (*i.e.*, the element on which the *ng-controller* tag sits and the descendants thereof).

2. To access variables from the controller, we need two things:

    a. The variable must be made a property of the $scope for that controller:
    ```javascript
    app.controller('appCtrl', ['$scope', function($scope) {
        $scope.name = 'Jordan';
        $scope.Math = Math;
    }]);
    ```
    b. The variable must be **interpolated** into the HTML by use of the double braces, {{ }}.
    ```html
    <div ng-controller="appCtrl">
        {{Math.pow(2, 3)}}
        <h1>Hello, {{name}}</h1>
    ```
    The code above will output an "8", and then the text "Hello, Jordan". Note that the interpolation causes an evaluation of expressions within it, but its *scope* (note the abscence of "$") is only that of the *$scope*. So, an expression such as {{2 + 2}} will evaluate to 4, but {{Math.pow(2, 3)}} will not evaluate, unless we put the Math object on the *$scope* object, as we do in the above example.
    
3. Note that we **do not need to refer to $scope** in the braces. That is done automatically.

4. **BIG IMPORTANT THING!!**: We want to make sure that whenever the contents of the $scope change, it will cause a re-rendering of the screen! For example, NgClassic provides a **$timeoout** service. This operates in the same manner as *window.setTimeout()*, except that if *$scope* properties are changed in the delayed function, it does not cause a re-rendering, whereas the *$timeout* service will do so.

## Directives
### Introduction

1. A **directive** is an instruction from Angular to manipulate an element of the DOM. It might be to hide it, to add a class, *etc*.

2. NgClassic comes with a substantial number of directives built-in, which handle many common tasks. In addition, we can create our own, custom directives. In this outline, we will first describe a number of commonly used built-in directives, then will devote substantial effort to learning how to create our own directives.

### Built-In Directives

#### ng-model
1. This may be the single most distinctive feature of NgClassic when it appeared. When placed on an input, textarea, form control, *etc*., it binds the input value to a property of the *$scope*. For example, we could have:
    ```html
    <div ng-controller="mainCtrl">
        <inmput ng-model="name" type="text" />
    </div>
    
    <h1>{{name}}</h1>
    ```
    In the above example, the value of the $scope.name property can be affected by changing it on the input box, and once the $scope.name property changes, a re-rendering is effected, causing the *name* variable to update wherever it is interpolated.  In addition, the value of the *$scope.name* property can be affected in the controller, and those changes would also cause a re-rendering.

#### ng-if
1. This directive, if added to an element, takes a conditional expression and adds the item to the DOM if the expression evaluates to truthy, but removes the element from the DOM if the expression evaluates to falsey.

2. In the following example, the alert shows if the password is not eight or more characters long:
    ```html
    <div ng-if="password.length < 8" class="alert-danger">
        Must be 8 characters long!
    </div>
    ```

#### ng-show / ng-hide
1. In effect, these two directives often act much the same as *ng-if*; however, there is a difference.

2. **ng-show** and **ng-hide** are complements of each other. Each takes a conditional expression; the former shows the element if its expression evaluates to truthy; the latter hides the element if its expression evaluates to truthy.

3. **Note** that whereas *ng-if* completely removed an element from the DOM, *ng-show* and *ng-hide* leave the element in the DOM, but add or remove a built-in class, **ng-hide** from the element, which makes the element invisible (its css is "display: none !important").

4. Note that "display: none", while leaving the element in the DOM, removes it from the view, so it won't take up any space on the screen. Contrast with "visibility: hidden", which leaves a blank space on the screen.

#### ng-class
1. This directive allows us to control the classes that are added to a DOM element. 

2. The directive takes an object in which the keys are class names, and the values are expressions to evaluate, so the class gets added if its expression evaluates to truthy.
    ```html
    <div ng-class="{
        'alert': name === 'bob', 
        'test1': name === 'joe
    }">
    </div>
    ```
    Pay attention to the quotation marks.

3. In addition, we can use *ng-class* with a value of a variable name. For example, if our controller $scope has a property "className" that had the value "warning", then the following would add the class "warning" to our element:
    ```html
    <div ng-class="className"></div>
    ```
    Multiple classes could be added as elements of an array:
    ```html
    <div ng-class="[className1, className2]";
    ```
4. We can also use ternary expressions to add classes:
    ```html
    <div ng-class="[condition] ? className1 : className2"></div>
    ```
5. When we have a list with the ng-repeat directive, we can use *$first*, *$last*, *$even*, and *$odd* to assign classes to particular items in the list. For example, let us add the class "topItem" to the first item in the list:
    ```html
    <div ng-repeat="item in items">
    <div ng-class="{topItem:$first}">{{item.name}}></div>
    ```

#### ng-repeat
1. This directive is attached to a tag and has the form:
    ```html
    <li ng-repeat="val in listItems">
        {{val.property}}
    </li>
    ```
    where *listItems* represents the name of a $scope variable that is an array, and *val* represents an item in that array. This causes NgClassic to iterate through the array and add an element to the DOM for each item.
    
2. Note that each iteration has an accompanying property, **$index**, which makes available the position of the val in the array.





####$Scope from the $Scope Service

1.	The $scope object is passed to the controller as an argument (this is an example of dependency injection), as follows:

		myApp.controller('myController', function($scope) {
			$scope.name = 'Jane';
			$scope.occupation = 'coder';
			$scope.getname = function() {
				return 'John';
			};
			
			console.log($scope);
		});
		
	In the above example, $scope is not just a random variable name, but a preformed object with lots of its own properties, although new ones can be added.  It is the glue that binds the model and view.
        


###Routing

1.	In order to set up routes for our single-page app, we need to follow these steps:

	a.	First, we need to load the *angular-route.js* (or *angular-route.min.js*) file into our page.
	
	b.	Second, we need to be sure to add 'ngRoute' as a dependency when declaring our angular module, as follows:
	
			const myApp = angular.module('myApp', ['ngRoute']);
			
	c.	Third, we need to run the *config()* method on the angular object, passing in **$routeProvider** as a parameter, as follows:
	
			myApp.config(function($routeProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'pages/main.html,
						controller: 'mainCtrl'
					})
					.when('/second, {
						templateUrl: 'pages/second',
						controller: 'secondCtrl'
					});
			})

		Note that each route is added by the *when()* method of the $routeProvider, which identifies the route, and attaches to it a template and a controller.
	
	d.	Finally, we need to add into our index.html page the <ng-view></ng-view> directive, where we wish the templates to be inserted.
	
	e.	**Route Parameters**: The service *$routeParams* is used to hold parameters in an url, which are identified with ":". So, for example, we could have the following url:
	
			.when('/forecast/:days, {
				. . .
			})
		
		and in the controller:
		
			app.controller('myCtlr', [$scope, $routeParams, function($scope, $routeParams) {
				$scope.days = $routeParams.days || 2  //a default values
				
			}])


###Custom Filters

1.	There are lots of filters built-in to Angular, so always take a look at what is available first. But we can also build custom filters easily.  To do so, imitate the following example, which will trim down a list of cities to those with temperatures over a minimum threshhold.

	a.	In the module page, add a filter to the module object as follows:

			myApp.filter('nameOfFilter', function() {
		
			})

	b.	The filter will return our sorting method, as follows:
	
			myApp.filter('nameOfFilter', function() {
				return function() {
				
				}
			})
	
	c.	In our example, we will pass into the filtering function a list of cities and the floor temperature, and we will return the sorting method:
	
			myApp.filter('nameOfFilter', function() {
				return function(cities, temp) {
					let hotSpots = destinations.filter(val => {
					return (val.weather && val.weather.temp && val.weather.temp >= minTemp)
				}
			});
			
	d.	When calling our filter in the webpage, separate parameters with colons, as follows:
	
			<section>
            <h2>Warm Destinations</h2>
            <div ng-repeat="destination in destinations | warmDestinations:20:23">
                <span>{{destination.city}}, {{destination.country}}</span>
            </div>
        </section>

## Services
### Introduction
1. All NgClassic services are, by convention, named beginning with a "$".

2. With one *enormous* exception, services in Angular are **singletons**.  A *singleton* is an object of which there is only a single instance. Thus, for example, if the singleton object is named "jordan", and somewhere in the code jordan.eyes is assigned the value "blue", then any time a reference to *jordan.eyes* is mad, it will return the value "blue," until it is assigned a new value.

3. **$scope** is the exception to the general rule.  *$scope* is an object, and inherits from the object **$rootScope**, for which there is one for the module.  However, **a new *$scope* instance is created for each controller**.

4. When a custom service is created, it is a singleton.  **This allows the sharing of data across pages!**

### Built-In Services

1. NgClassic comes with a long list of built-in services, *$scope* being the most constantly used. Below, we look at a few others. In addition, one can find information on services at the Angular API reference.

2. Some of the nost frequently used services come with the core *angular.min.js* file. However, many others are built-in, in the sense they have been written by the Angular team, but must be downloaded as a separate module. If that is the case, then we must download that module **after** we download the *angular.min.js* module, but before we call our local *app.ja* file.

3. Then, we will need to place in the *angular.module()* method second parameter (the array), the name of the modules on which our *app* module depends. For example:
    ```
    const myApp = angular.module('myApp', ['ngMessages', 'module2' . . .]);
    ```
4. Once we have injected the modue as a dependency into our module, we can inject its services into our controller.
#### $scope
1. This is the service that is constantly being used. **It is the glue between the model and how it is manipulated by the controller and the view**.

2. Any property on the *$scope* object can be accessed in the portion of the view subject to the controller by using the double braces, {{ }}.

#### $log
1. This is a very simple service, which outputs given messages to the console.  It is an object, with five methods:

    a. *log()*, which simply logs out a message,
    
    b. *info()*, which logs it with the little blue-circle *i* next to the message,

    c. *warn()*, which has a yellow background and a triangle holding an exclamation point,
    
    d. *error()*, and
    
    e. *debug()*.

2. In order to use the *$log* service, it would be assigned into the controller in question, then it could be called, for example, as the method attached to an *ng-click* directive.

#### $filter
1. This is a service that takes the name of a filter (as a string) and returns a filter function. So:
    ```javascript
    $filter('uppercase') //returns the uppercase filter
    
    //newText will be oldText in all upper case letters.
    $scope.newText = $filter('uppercase')($scope.oldText);
    ```
::: danger
    This can also be used in the a template with pipes:
    ```javascript
    {{expression | filter_name[:params]) }}
    ```
:::
#### $http
1. This is a core module service that takes a single argument, a configuration object, which it uses to generate an HTTP request, which returns a promise. The configuration object has a number of possible properties, the two important ones being the *method* (e.g., 'GET', 'POST', etc.), and the url.

2. Note that the returned promise now has a *then* method, whereas it formerly had a *success()* and an *error()* method.
    ```javascript
    $http( {
        method: 'GET',
        url: '/some url',
        params: '',
        data: //used for POST requests
    })
    .then (
        callback(res),
        callback(err)
    );
    ```

#### $resource
1. This service requires installing the angular-resource.js module, then injecting it into our angular module. This makes available the *$resource* service and the *$resourceProvider* provider.  We use *$resourceProvider* to change the default behaviors of the *$resource* service.

6.	**$location**: a service in the main angular module, *$location* has a **path()** method that returns the hash portion of the url.


####Custom Services

1.	As noted previously, custom services in Angular are *singletons*, allowing the transfer of data throught the service across scopes.

2.	To create a service in a module, use the following syntax:

		myApp.service('myService', function() {
			this.name = 'John Doe';
			this.nameLength = () => {
				return this.name.length;	
		});
		
	In this example, myApp is my Angular module, myService is the name assigned to the newly created service.  Note the use of the arrow function in the service in order to avoid having to use the "that = this" workaround.
	
3.	To make use of a custom service in a controller, one must inject it into the controller, as follows:

		myApp.controller('mainController', ['$scope', 'myService', function($scope, myService) {
			$scope.name = nameService.name
		}]); 

#####Example

1.	The following example points out the fact that the $scope service is *not* a singleton.  In the example, we create a service with a name property, and in each of two pages, inject the service, as follows:

		myApp.controller('mainController', ['$scope', '$log', 'nameService', function ($scope, $log, nameService) {
			$scope.name = nameService.name;
		}]);
		
2.	Also, in our two html pages, we have input fields that we bind, using ng-model, to their respective controllers:

		<h1>This is the Main page.</h1>
		<hr/>
		<input type='text' ng-model='name'/>
		
3.	So, when each page is opened, it has the original name in the input block. However, if we change the box content on the main page, it **does not update** on the other page.  This is because they are in two different scopes.  What we need to do is update the service, then have the service update the other scope.

4.	Keep clear, AngularJs binds $scope so that it is always updating when the bound HTML element changes; however, there is nothing that automatically forces the value held in the service to be updated.

5.  We can, however, designate a method to occur upon any change in a $scope property, by using the $watch() method, as follows:

		$scope.$watch('name', () => {
			myService.name = $scope.name
		})
		
	In the above, when $scope.name changes, it sets off *$watch* and the callback function runs, so that our name value on myService gets assigned the new name value.
	
6.	Remember, however, that if the page is refreshed, all the data will be lost, unless it is stored to localStorage or some other spot.


###Custom Directives

1.	**Normalization**: Angular incorporates a convention of normalization of directive names between the DOM and JavaScript. In DOM tags, directives are referenced using wasp syntax, with hyphens between words. For example:

		ng-init
		ng-this-directive
		
	This would, of course, be verboten in JavaScript, in which variable cannot contain hyphens.  Therefore, in the controller, etc., the directive names are written in sad camel case (head is low), like this:
	
		ngInit
		ngThisDirective
		
2.	**Basic Use Case**: Think of the custom directive as the equivalent of a react component.  For example, we might have a block of code we will want to use frequently:

		<div>
			<ul>
				<li> blah </li>
			</ul>
			<button> blah </button>
		</div>
		
	Rather than writing out the component over and over, we can do the following:
	
	a.	Go to the app module page, where the controllers are listed.  Add to the app module a directive, along these lines:
	
			myApp.directive("searchResult", function() {
				return {
					template: '<div><ul><li> blah </li></ul><button> blah </button></div>'
			})
			//Note: the string can be a template literal, with ${}
	
		Note that the directive has two inputs, a name for the directive (searchResult in the above example), and a function that returns an *object*.  The only property in the above example is **template**, which is a string of the block of html. 

 	b.	In the HTML page, simply insert the directive (using wasp-type) into the DOM where the template should go.  **Do not** use self-closing tags.  Something along the lines of:
 	
 			<div class="container">
            	<div ng-controller="mainController">
                	<my-direct></my-direct>
               	 	<my-direct></my-direct>
            	</div>
        	</div>
 	
 		
	c.	This will place the template inside the <my-direct></my-direct> tags on the DOM. To avoid this, and simply replace the tags with the template, use the "replace" property in the returned directive object, set to "true".

3.	As an alternative, the directive can be placed inside a DOM element as an attribute, as follows.  The *replace* property works as before:

		<div class="container">
			<div ng-controller="mainController">
				<div my-direct></div>
				<div my-direct></div>
			</div>
		</div>
		
4.	There is also a **restrict** property on the directive object. It takes the values "A", if the directive can be used as an attribute only, "E" if it must be used as an element, and "AE" or "EA" if it can be used in either way.  **Default is "AE"**.  May also be "C" if it is attached as a class, or "M" if as a comment:

		<div class="container">
			<search-result></search-result>  	/E
			<div search-result></div>			/A
			<div class="search-result"></div>	/C
			<!-- directive: search-result -->	/M
		</div>
		
5.	One might notice that typing out the template in a single string is a big pain in the ass.  Thus, we are able to do the following:

	a.	Make a directives folder,
	b.	Create an html file to contain our template,
	c.	in place of the "template" property on the directive object, use a "templateUrl" property, and give a path for its value to the appropriate template.
		

	Example:
	
		myApp.directive("myDirect", function() {
			return {
				restrict: 'AECM',
				templateUrl: 'directives/searchresult.html',
				replace: true
			}
		});


6.	Some directives may be self-contained, with no reference to their surrounding scope, for example, a simple template with no interpolated values.  However, many times the directive will contain interpolated values that will refer to the scope in which the directive is contained.

7.	One of the main reasons for having the directive is to create a reusable component. Especially in a large application, it may be placed into different controllers and different pages. This can create a problem if the variables in the scope in which it is placed are not consistent with those in the scope for which it is created. The scope can have a property that creates **isolated scope**, which means that the scope of the directive is **not** that of its surroundings, but is its own, unique, scope. This is done as follows:

		myApp.directive('myDirective', function() {
			return {
				restrict: . . .,
				templateUrl: . . .,
				replace: . . .,
				scope: {
				
				}
			}
		});

8.	This takes care of isolating the directive, but often we will not wish for it to be completely isolated, we will have data that we need from the surrounding scope.  We can "poke holes" in the scope as follows:

	a.	Identify the desired value as an attribute of the directive, for example:
	
			<search-result person-name="{{person.name}}"><search-result>
			
		In the above example, we have a directive called "search-result", and it needs the name value, which is contained in the controller associated with the template in which the directive sits.  So, we interpolate the value and assign it to the attribute "person-name."

	b.	Next, we go into the directive, and add the attribute into the scope value:
	
			myApp.directive('myDirective', function() {
				return {
					restrict: . . .,
					templateUrl: . . .,
					replace: . . .,
					scope: {
						personName: '@'
					}
				}
			});

		As shown above, we assign an '@' symbol to the sadCamelCase attribute name.  The '@' symbol signifies that the passed-in item is a string.  This is a little bit of a "magic short-cut," depending on the fact that the property name in the scope object is the sadCamel version of the attribute name. If that were the case, then it should be written as:
		
			myApp.directive('myDirective', function() {
				return {
					restrict: . . .,
					templateUrl: . . .,
					replace: . . .,
					scope: {
						taco: '@personName'
					}
				}
			});
		  
		The important thing is that the name after the @ symbol match the attribute name in the directive as used.
		
9.	We can also pass an object through the scope of the directive. In such a case, we are not merely passing a string with one-way data binding; the object will be passed as a reference, and changes to properties of the object would pass both ways.

10.	The syntax for passing an object is as follows:

	a.	We pass the desired object to an attribute of the directive, but not through interpolation.  For example, if our person object has name and address propertyies we want, instead of two string pass-ins, we can do:
	
			<search-result person-object="person"></search-result>
			
	b.	Next, we go into the directive, and add the attribute into the scope value:
	
			myApp.directive('myDirective', function() {
				return {
					restrict: . . .,
					templateUrl: . . .,
					replace: . . .,
					scope: {
						personObject: '='
					}
				}
			});
			
		Notice the "=" sign, which indicates an object is being passed in.  Also, the same shortcut is at play here, we could change the scope field to:
		
			scope: {
				taco: '=personObject'
			}
			
11. Finally, we can pass in a function through the directive scope, although there is a bit of "magic syntax" for dealing with the funtion arguments.  To do so, we do the following:

	a.	We pass the desired function to an attribute of the directive, with parameters.  The names of the parameters is not important (see below), but should be the correct number.
	
			<search-result
				person-object="person"
				call-out-function="callOut(myPerson)">
			</search-result>
			
	b. In the directive, we can add the function to the scope, as follows:
	
			myApp.directive('myDirective', function() {
				return {
					restrict: . . .,
					templateUrl: . . .,
					replace: . . .,
					scope: {
						personObject: '=',
						callOutFunction: '&'
					}
				}
			});
			
	c.	In the directive template, we can use our function via interpolation, but must pass in the parameters via *mapping*, as follows:
	
			<h5>{{ callOutFunction ({myPerson: personObject) }}</h5>
			
####Directives - Compile and Link

1.	Another propery that can go on a directive is the "compile" property. Its value must be a function, which returns an object containing two properties, "pre", and "post." The following is an illustration:

		myApp.directive('myDirective', function() {
				return {
					restrict: . . .,
					templateUrl: . . .,
					replace: . . .,
					scope: {
						personObject: '=',
						callOutFunction: '&'
					},
					compile: function(elem, attrs) {
					
						return {
							pre: function(scope, elements, attrs) {
							
							},
							post: function(scope, elements, attrs) {
							
							}
						}
						
					}
				}
			});
			
	The two parameters of the compile() function are *elem*, the element that is the directive, and *attrs*, the attributes of the directive. Each of the returned methods, *pre* and *post*, take three parameters, including a scope.
	
2.	Note that AngularJS uses the jQLite library for traversing and dealing with the HTML contained in the directive.  Plain JavaScript methods (such as *element.classList.add()*, or *document.getElementbyTagName()*) will not work.

3.	The *compile* method allows us to change the directive dynamically, **before it gets used**.  Then, the *pre* and *post* methods allow each instance of the directive (for example, if the directive is repeated in a list) to be modified with its own scope.

4.	The *pre* link method is discouraged from use in the Angular notation. *Pre* runs on each directive, and then on directives within the directive, etc., down the chain. Then, the *post* link functionality runs on the end of the chain directive and back up the chain.  However, without a specific use needed, just don't use the *pre* link.

5.	The link (*i.e.*, the *pre()* and *post()*) methods allow us to modify individual instances of the directive, based on information contained in the scope.  For example, if the person's name matches some value, then a class could be added to highlight the information.

6.  Note that it would be very unusual to place any functionality in *compile()*.  It will normally just be empty.  If something needed to be added, removed, etc., from every instance of the directive, then we could just change the directive.  So, we normally use the following shorthand:

		myApp.directive('myDirective', function() {
			return {
				restrict: . . .,
				templateUrl: . . .,
				replace: . . .,
				scope: {
					personObject: '=',
					callOutFunction: '&'
				},
				link: function(scope, elements, attrs) {
					

				}
			}
		});
		
	The above is simply a shorthand for an empty *compile()* method returning a *post()* link.  Note that is there were a large number of uses of the directive, *compile()* would be more efficient, if scope information was not necessary, since the change could be made at the lower level, rather than on each instance.
	
	
####Directives - Transclusion

1.	**Transclusion** is a computer-science term for the inclusion of one document inside another.  *I.e.*, taking a copy of one document and placing it at a particular point inside another document.

2.	Angular provides a directive, **<ng-transclude></ng-transclude>** which, when placed into the HTML of a directive's body, tells where to place any text placed in the original directive when it is placed in the document body.  For example:

		//First, in the HTML where the directive "search-directive" is placed:
		<h3>Search Results</h3>
		<div class='list-group'>
			<search-directive attributes=" . . . ">
				This is the text to be included
			</search-directive>
		</div> 

		//And in the template for the "search-directive" directive:
		<a href="#" class="list-group-item">
			<h4 class=". . .">{{person.object.name}}</h4>
			<p class=". . .">
				. . .
			</p>
			<ng-transclude></ng-transclude>
		</a>
		
	In addition, *ng-transclude* can be placed as an attribute on a tag, rather than being an element.
		
3.  However, in order to make this work, we must add the **transclude** property to the directive, and set it to true (the default value is false), as so:

		myApp.directive('myDirective', function() {
			return {
				restrict: . . .,
				templateUrl: . . .,
				replace: . . .,
				scope: {
					personObject: '=',
					callOutFunction: '&'
				},
				transclude: true
			}
		});

###Testing AngularJS

####A. Getting Started

1.	The karma-cli and phontomjs should be installed globally:
	
			npm install karma-cli phantomjs -g
	
2.	Set up application with npm with the following dev-dependencies:
	
	a.	bower,
	b.	jasmine,
	c.	karma
	
			npm install bower jasmine karma --save-dev	
3. In our app folder install the following bower dependencies:
		
	a.	angular,
	b.	angular-mocks
		
			bower install angular angular-mocks --save
		
4.	Set up an index.html file and a scripts folder in the app.
	
5.	In the script folder, set up an app.js file for our angular code, and a test folder.
	
6.	In the test folder, set up a "unit" folder, and in that folder set up a testing file.
	
7.	Go to the test folder in the app in the terminal, and run:

		karma init
		
	This will take you through a series of questions, in order to set up the **karma.conf.js** file, which is where the configurtion for karma is handled.  Make the following choices:
	
		a.	Testing Framework: Jasmine
		b.	Use RequireJS: no
		c.	Browser: PhantomJS
		d.	File includes/excludes: leave blank for manual setup
		e.	test on file changes: yes
		
	In the karma.conf.js file, start out by including:
	
		files: [
        	'../../bower_components/angular/angular.js',
        	'../../bower_components/angular-mocks/angular-mocks.js',
        	'../app.js',
        	'unit/*.js'
    	],
    	
8.	**TO START IT UP** go to the test directory in the terminal and run:

		karma start karma.conf.js

####B.	ngMock

1.	The npm installation of angular-mocks, and inclusion in the files property of the karma configuration, automatically adds the ngMock module to tests.

2.	*ngMock* provides methods to insert the angular components into the test:

	a.	**module()**: module('*module name*') sets up the module configuration information. The module will always need to be included in tests.
	
	b.	**inject()**: inject() is used to inject angular components into our tests.  The following is an example:
	
			var scope = {};
			var ctrl;
			inject(function($controller) {
				ctrl = $controller('myController', {$scope: scope});
			}) 
			
			
####C.	beforeEach / afterEach

1.  **beforeEach()** and **afterEach()** are two methods used in testing to set up the environment for each test, or clean up the environment, respectively.

2.	For example, every test involving angular will need a *module()* method call to set up the angular configuration.


####D.	Testing an HTTP Call

1.	To test an HTTP call, we will need to inject into our testing the **$httpBackend** service (from ngMock).  So, our beforeEach function may look like:

		beforeEach (
			inject ( function( $controller, $rootScope, $httpBackend ) {
				scope = $rootScope.$new();
				ctrl = $controller( 'testingAngularCtrl', { $scope: scope });
				httpBackend = $httpBackend;
			)
		)
		
2.	In our actual test, we should use $httpBackend's method **expectGET** (for a GET request, obviously), which will have the full url as a parameter, then chain onto that the **respond()** method, which takes as a parameter the simulated data.  For example:

		it('should update the weather for a specific destination', function() {
            scope.destination = {
                city: "Melbourne",
                country: "Australia"
            };

            httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&APPID=" + scope.apiKey)
                .respond(
                    {
                        weather: [{
                            main: 'Rain',
                            deatail: 'Light rain',
                        }],
                        main: {temp: 288}
                    }
                );
            scope.getWeather(scope.destination);

            httpBackend.flush();

            expect(scope.destination.weather.main).toBe('Rain');
            expect(scope.destination.weather.temp).toBe(15);
        });
        
       The *$httpBackend.expect()* is the full, all-options method.  There are also shortcut methods such as expectGET, expectPOST, expectPUT, etc. These methods are testing that the call is correctly made.
       
       The *$httpBackend.respond()* method can take either an integer (e.g., 200, 404, 501) or an object, representing the actual data response.
       
       The *$httpBackend.flush()* method tells angular to respond to all pending requests. 
       
3.	Finally, we need to run methods in our *afterEach* block to check whether all requests defined in *expect* were made, and that all of them were flushed:

		afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest()
            //cleanup code
        });
        
####E.	Testing Timeouts