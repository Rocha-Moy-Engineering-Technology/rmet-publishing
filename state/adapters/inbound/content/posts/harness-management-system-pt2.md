---
title: 'Part 2: Organizing Harnesses, Agents, and Projects'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## This Is Not Another UI

Let's get something out of the way before we start. This is not about creating another UI to interface with different models or different harnesses. Yet another UI. This is about leveraging — about harnessing — what already exists.

It's about harnessing what companies are already pouring tons of money into. A lot of person hours are being poured into these different harnesses and different models.

This is not about creating something new entirely. This is a conceptual framework that defines a structure, and the way that structure interacts, in order to leverage and optimize the use of these different harnesses — efficiently and effectively, without waste.

## Building on Shared Primitives

So then right off the bat, the engineer in me understood that we needed a way to ensure that the commands, which were still a thing when this… These are going away now for some of the harnesses; some of the popular harnesses have done away with commands, even though Claude Code still retains them to the date of this writing. But it turns out that there are some primitives that are shared amongst the different harnesses. Skills, and at the time commands. Skills, sub-agents. And sub-agents, they're still coming along. They weren't well supported yet when I started this work, but I knew that sub-agents were going to be a thing. So from that point I started working with the primitives that were shared and well understood and implemented amongst the different harnesses.

And then I've been progressively implementing these primitives within this conceptual framework, which allows me to create this primitive once and have it deployed to the different harnesses. So you can think of it as keeping things dry. Keeping my markdown dry. I write this command once, and the command is supposed to get deployed to the different harnesses, taking into account, at the time, the differences and solitudes between the different harnesses.

And so that gave a start to what I call today a harness management system.

## Isolation

So, isolation. We want to be able to have our source code, our application, our service, isolated from the harness, so we are able to switch back and forth with different harnesses. And we can make it such that the application that we're developing is not aware of which harness we are working on. So we abstract the harness away from the application, and that gives us this ability to switch between harnesses and attain the same sort of ability to work on these codebases.

With this isolation now, we can create these structures that allow us to keep the development of these harnesses following best engineering practices, such as keeping them dry, such as differentiating between specialized agents and generic agents. That is, not having a single context file for every single job that we do. So we're able to specialize.

## Agents and the Compiler

Within the efforts of managing different agents — which are not to be confused with harnesses — we should differentiate between harnesses and agents. You can think of an agent as being an instance of a harness session with its selected tooling, its selected tools and context. So in order for us to come up with different agents, we have built a compiler that allows us to easily manage these different agents. This allows us to build agents not just with different context, but obviously with different tooling, which is what makes up an agent. So we can look at the definition of an agent now being an instance of a harness that has a specific context and has a specific set of tools, powered by a specific model.

And that's going to be our definition, and that gives us, naturally, our definition of an agent: harness, context, tooling, and the driving model.

## Agents, and Why They Are Not Sub-Agents

Sub-agents are something that we already share amongst the harnesses, and something that we can always add. If we have sub-agents, then the agent should be considered the main thread agent that the harness controls, orchestrates, and runs. Then we should be able to create different agents, and attach these different agents to different projects, and have different agents work on the same project. Because of isolation, we get to do that.

We get to have these agents — and I want to differentiate that from sub-agents. We get to have these agents, basically these sessions, main thread agents: different main thread agents that are specialized and purpose built.

If you walk through the progression here, we started with wanting to be able to work with different harnesses, and to develop with different harnesses as if we were developing with one harness. That caused us to go into the concept of isolation, and having our application code not be aware of what harnesses we are actually using. And that brought us to now being able to come up with specialized sub-agents, or specialized agents, for performing purpose-based tasks that are specific for the different purposes.

## The Four Pieces

And out of that, we have a structured way of doing that. We have a structure where we have a place that's common to all agents. We have the different agents. And then finally, we have a context structure that is specific to the projects that you're working on. So you have these four pieces:

- **Commons:** a location for what is shared across agents.
- **Context:** a location for the context specific to the projects we're working on.
- **Agents:** a location for the agents themselves.
- **Supervised projects:** the projects those agents supervise.

And this is the essence of a harness management system. I'm able to keep a growing infrastructure that's shared amongst all the different harnesses. And I'm able to quickly spin up different projects and attach different agents to them, and I'm able to manipulate these agents.

So I'm able to very flexibly start new projects, scaffold new projects with different agents, pick different agents, modify different agents. And so it's about manipulating the infrastructure that supports the agents: creating different agents and creating different projects, creating different views of the projects, and attaching purpose-based agents to these projects. So basically picking the right tool for the job, and using the tool in the right way to get the best results possible.
