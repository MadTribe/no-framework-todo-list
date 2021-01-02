# no-framework-todo-list

## Introduction

It is very common for developers to ask "What Framework Should I use?"
On the front end in 2021 this might mean React, Angular, Vue or Svelte. In the past it was jQuery.

These frameworks offer a lot out of the box, but they also add unused download bloat, enforce certain structures (can be useful but discourages developer creativity) and puts a layer of abstraction between the developer and the web platform.

For developers one of the great attractions of frameworks is how much code they can save. 

So in this repo I want to explore how to efficiently create a todo list application with just plain old javascript. I've chosen a todo list application because it is a common example for many frameworks to show.

Currently the app has only **158 lines of js** code and is **< 5kb** download <u>uncompressed</u> (apart from a random winter decoration I added for my son.)

Compare this to the minified Vue.js framework (one of the better ones) which  is ~40kb out of the box before you write a single line of code. 

The no-framework approach does have drawbacks, but it means ultimately you will invest your time in learning how the web platform actually works and how to get more out of javascript by, creating useful abstractions that keep your work efficient. 

Ultimately you may decide that a framework is right for your project, but knowing how and when to work without one is a great asset to any developer. 

## Installation

**None**. Just clone the repository and open the index.html (that's part of the point)

## Features
1. Add Todo
1. Edit todo
1. Delete todo
1. Complete Todo
1. Persist to localStoreage

### Rules

No external JS frameworks or libraries. 

Note I started out by including the [tactic CSS library]([GitHub - yegor256/tacit: CSS Framework for Dummies, Without Classes](https://github.com/yegor256/tacit) which is a non opinionated library for just making raw html look ok. I may remove it later. 



### Current Screenshot

![screenshot_v1.png](./docs/screenshot_v1.png?raw=true)

## Discussion

Obviously nobody should be saying that frameworks are a universally bad thing.

Let's look at the benefits of frameworks and the counterpoints to those benefits. 

| Framework Benefit                            | Description                                                  | Counterpoint                                                 | Conclusion                                                   |
| -------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Write less code                              | Many frameworks offer features that allow you to write concise code for your projects | We're showing in this project that you can develop a useful app with very little code. By offering so many features that you are not using frameworks will tend to bloat your code. | Assess your projects features and decide whether the framework or library really offers significant benefit for what you need. |
| More standardized  across the industry.      | If you learn a popular framework like React or Vue you will easily fit into teams that are using those frameworks. | Frameworks evolve and go out of fashion. Especially in the front end world you can invest a lot of time learning a framework and then your next job is using something else. Whereas the underlying web platform is likely to exist for many years to come. | It is always wise to balance your career development with what the industry needs. But ultimately what the industry needs is people who are flexible and creative. |
| More standardized  across the industry **2** | If I use a framework on my project I can easily hire developers with that skill and they will do an OK job. | Many developers spend a lot of time in a project trying to fit the business requirements that they want to build into the structures imposed by the framework. If your project is a long term one then over the course of several years the framework technologies will keep developing and may not retain backwards compatibility so the web platform evolves and you are stuck with today's decisions whilst the startups are using the next latest thing. | Depending on the size of your project, the skills you have in-house and the business requirements you need to implement then your architects must make decisions on this matter. However it is a good policy to hire developers who at least have the ability to work outside of frameworks and understand the base platform they are working on. |
| Security                                     | Frameworks have a lot of eyes on them looking for security issues and when one is found it can be quickly fixed by the community. | Frameworks have a lot of eyes on them looking for security issues. Some of the malicious people looking for issues don't report them to the community though. Because your code is pulling in lots of features you may not use you do not know what bugs and issues exist inside your dependencies. A reasonable way to reduce your security exposure is to reduce the number of unused features you are shipping. | Security is ultimately your own responsibility. Blaming a breach on a bug in a tool or framework will not be any consolation to your clients or users and  so building up an in-house (or in head) understanding of security principles is key as well as a discipline of security review and auditing. |
| Best Practices                               | Frameworks are written by smart people that help you structure your code according to best practices. | You can still learn from smart people and study their best practices and how they suggest you should structure your code. But ultimately they do not know about your application. They are providing general structures for general purposes, but your specific purpose may have a better or more elegant solution. <br />You may end up using your own creativity to discover the next big design pattern that everyone else will use in 5 years. | For large teams with a high turnover of relatively inexperienced staff, frameworks can be useful to keep them working well together in a consistent way. For mature teams that are capable of having an ongoing discussion about what is best for their project there are obviously more possibilities available to them. |
|                                              |                                                              |                                                              |                                                              |

Finally, working without a framework can just be a lot more fun!