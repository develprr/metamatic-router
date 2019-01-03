# The Metamatic Router

A router extension to Metamatic state management framework.

## Contents
* [Introduction](#introduction)
* [Usage](#usage)
  - [Connecting to Router](#connecting-to-router)
  - [Disconnecting from Router](#disconnecting-from-router)
  - [Mapping Components to Routes](#mapping-components-to-routes)
  - [Programmatically Redirecting to Routes](#programmatically-redirecting-to-routes)
  - [Configuring Base Route](#configuring-base-route)
* [Miscellaneous](#miscellaneous)
  - [Licence](#licence)
  - [Author & Copyright](#author-and-copyright)
  - [Background](#background)
  - [Read More](#read-more)


## Introduction

The Metamatic Router is a simple router component installed on top of the core (Metamatic State Manager)[https://www.npmjs.com/package/metamatic] framework.

When you use Metamatic state manager framework you can use any router library available around the Internet. But some of those solutions require you to wrap
your app's root component with some clumpy "Routing Provider" components before you can implement routing. Or if you want to programmatically soft-redirect
your app to a certain sub-url then you may need to wrap your redirecting component inside some obscure wrapper again, possibly breaking your code's 
otherwise sleek and clean syntax. 

For this reason, Metamatic provides a simple out-of-the-box routing feature. It may be a viable alternative to some external routing libraries. This depends of course
on your use case.

*[<- Back to contents](#contents)*

## Usage 

### Connecting to Router

To use Metamatic routing feature in your app, subscribe your main component to listen for URL changes with
 **connectToRouter** function: 

```js
componentDidMount = () => connectToRouter(
    this, 
    (url) => this.setState({...this.state, url: url})
);
```


The code snippet above causes the connected component to retrieve the updated URL from Metamatic when the URL changes. Then 
the listener component is re-endered causing the main component show a different set of components based on that URL.

The code snippet above causes the main component to re-render itself every time the URL changes.

### Disconnecting from Router

Any component that has a de-facto life cycle, meaning it will removed, deactivated or unmounted during the application's run-time, 
should be disconnected from the router upon unmount event. To disconnect a React component from the Metamatic router can be done 
with **disconnectFromRouter** function:

```js
componentWillUnmount = () => disconnectFromRouter(this);
```

Note that in the root component of a React app, such as *App.js* or *Main.js*, however, it is not necessary to disconnect from the router
upon unmount event since the root component only "dies" when the application tab or window is closed anyway. 

*[<- Back to contents](#contents)*

### Mapping Components to Routes

Inside your main component, make render function optionally render different components based on the current URL pattern
using **matchRoute** function. As first parameter, give *matchRoute* any **regular expression** to define which URL patterns
will match the current URL, thus causing the related component to be rendered that defined in the second parameter:

```js  

render = () => (
  <div className='main'>
    {matchRoute('/', <Header/>)}
    {matchRoute('/language', <LanguageView/>)}
    {matchRoute('/vocabulary', <VocabularyView/>)}
    ..
  </div>
)
```

### Alternative Ways of Connecting to Routes

Since *matchRoute* function does not need the current URL as parameter, you don't necessarily need to retrieve the URL parameter from Router at all
in your main component where you define the actual routes. Therefore you can cause re-render by setting state without any modification to it:

```js
componentDidMount = () => connectToRouter(
    this, 
    (url) => this.setState(this.state)
);
```

Or use React's *forceUpdate* function, event though some puritanists may consider it ugly. But *beauty is in the eye of the beholder*. What works, just works:

```js
componentDidMount = () => connectToRouter(
    this, 
    (url) => this.forceUpdate()
);
```

### Configuring Base Route

When you deploy your app to some sub-folder of your domain instead of domain's root, you must define the sub-path invoking **configureBaseRoute** function  
at some early point of your app.
For example, I want to place my router demo app in sub folder 'router' of Metamatic demo domain [https://metamatic-demo.herokuapp.com/router/](https://metamatic-demo.herokuapp.com/router/):

```js
configureBaseRoute('/router');
```

*[<- Back to contents](#contents)*

### Programmatically Redirecting to Routes

Whenever you want your app to programmatically redirect to some view defined in routes, use **redirectTo** function:

```js  
onClick = () => redirectTo(someUrlPath);
```

To see a complete example of using the Metamatic routing feature in action, please check out [The Metamatic Router Demo](https://github.com/develprr/metamatic-router-demo) on GitHub.

*[<- Back to contents](#contents)*


## Miscellaneous

### Licence 

Apache 2.0

### Author

[Heikki Kupiainen](https://www.linkedin.com/in/heikki-kupiainen) / [metamatic.net](http://www.metamatic.net)


*[<- Back to contents](#chapters)*
