---
title: 'Agentic development with multiple harnesses and models: A hedge against the AI chaos. Part-I'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## This Is Not Another UI

Let's get something out of the way before we start. This is not about creating another UI to interface with different models or different harnesses. Yet another UI. This is about leveraging, about harnessing, what already exists.

It's about harnessing what companies are already pouring tons of money into. A lot of person hours are being poured into these different harnesses and different models.

This is not about creating something new entirely. This is a conceptual framework that defines a structure, and the way that structure interacts, in order to leverage and optimize the use of these different harnesses in an effective way — efficiently and effectively, without waste.

## Why Think About It This Way

So we're going to start with some motivation for thinking about it that way. The principle is that we have a lot of people, in labs and in companies, pouring a lot of time, man hours, and money into this. We don't want to fail to take advantage of that, and we want to be prepared for the chaos that is this race to the top, in the pursuit of AGI. We are not sure yet which companies are going to make it, and perhaps multiple companies will make it.

But along the way, we want to be able to take advantage of the leaps that will be accomplished by these companies, and not be stuck to a single tool. Not be impaired by outages, not be impaired by your Wi-Fi going out, or even your electricity going out. We live in the world of batteries and computers and laptops, and we should still be able to be very productive and to make use of the tools that allow us to work under different conditions and circumstances. Optimally when we can, and in best-effort mode when we cannot.

We don't want to grow over-reliant on any of these companies and let them dictate how we do our work. People think that because of these harnesses, and the way they work, and the way that they're coded, we don't have choices anymore and we can't tune them to work the way that works best for us. That's just not the case. There's a lot that we can do in order to make this effective, so we can be as effective as possible.

## How I Got Here

Right at the start, I mostly relied on Claude Code to do my work. But I already had concerns about being over-reliant on Claude Code, and I sort of kept Codex nearby, for the case where something happened to Claude Code and the services got interrupted. And now I'm so reliant on Claude Code to move as fast as I do, or to get the work done, that my clients won't accept my excuse of Claude Code not working. And especially given the beginning of this agentic era, the use of these tools wasn't quite as apparent.

What I'm trying to say is that I'm honestly quite comfortable with anyone I'm working with using the tools of their choice — the tools they're most comfortable, most confident, and most efficient with.

So one day I had Claude Code just have an outage, and work stopped. I already knew that this would happen, so I switched to Codex. I hadn't done any significant work in Codex up to that point, and to my pleasant surprise, Codex had improved a bit. It wasn't up to snuff yet with Claude Code as a harness. So Claude Code at that point still remained a superior choice, and as soon as the services got restored, I went back to working with Claude Code.

But ever since that day, I understood that I couldn't just rely on one company, one service, one tool — especially if that tool became the centerpiece for how work gets done. So then I started developing things that made sense for me: a way of working with a tool that made sense from the perspective of Codex as well.

## Building on Shared Primitives

So then right off the bat, the engineer in me understood that we needed a way to ensure that the commands, which were still a thing when this… These are going away now for some of the harnesses; some of the popular harnesses have done away with commands, even though Claude Code still retains them to the date of this writing. But it turns out that there are some primitives that are shared amongst the different harnesses. Skills, and at the time commands. Skills, sub-agents. And sub-agents, they're still coming along. They weren't well supported yet when I started this work, but I knew that sub-agents were going to be a thing. So from that point I started working with the primitives that were shared and well understood and implemented amongst the different harnesses.

And then I've been progressively implementing these primitives within this conceptual framework, which allows me to basically create this primitive once and have it deployed to the different harnesses. So you can think of it as keeping things dry, basically. Keeping my markdown dry. I write this command once, and the command is supposed to get deployed to the different harnesses, taking into account, at the time, the differences and solitudes between the different harnesses.

And so that gave a start to what I call today Asterifold. Asterifold comes from A star, the concept of A star, which is a classical way of doing search in AI — a classical AI method for doing search using heuristics to improve conversions — and fold, from many fold, in this case from having many different harnesses and agents.

## The Field Is Crowded Now

Now, in this day and age, we have some fierce competition amongst competitors, and different players joining the field. We're not just between Claude Code and Codex anymore. We have xAI and SpaceX with their Grok model and their harnesses, and Cursor. And then we have open-weight models, which can no longer be disregarded as things that don't have use for it. And we have a bunch of different harnesses that are being developed by some very talented people, and that's work that's going into these tools that can be useful if you know when to use each. Even though this may sound like an untrackable way of thinking about this problem, it's more about keeping your options open and not putting your eggs in a single basket.

So I need to be quite comfortable switching between Codex, or OpenAI, or Anthropic, or in this case xAI, if any of these suffer an outage that's not shared amongst other companies. And what if they do — what if all of these go down? So what about local AI? Local AI cannot be disregarded anymore as something of the future. And very soon, we will be able to be leveraging local AI with some reasonable power, especially as Apple rages on with local AI and they're betting on doubling down on it.

## Harness and Model Are Coupled

So we need to have these options open, and we've got to consider these harnesses and these models. It's already a fair point to make that some of these models may have benefits over different types of tasks compared to other models. I probably don't have to convince you of that. But the same is applicable to the different harnesses, and especially with the coupling between harness and model, I wouldn't want to select a single harness to work with all the different models — even if you could. Because you have to concede that Anthropic's Claude Code is optimized for Anthropic's models, and Codex is optimized for OpenAI's models, and now Cursor too, and Grok is optimized for xAI as well. So we have this coupling.

And so there's a bit of a matrix there. Not just from the point of view of being agnostic and being safe, should something happen to one of these companies, should something happen temporarily to the services, but also from the point of view of how effective we can be with some of these tools. These are just tools. At the end of the day, what's to be understood is that these are just tools. They are very useful tools, but they're just tools nonetheless, and we should pick the best tool for the job.

## The Other Harnesses

Other options that are out there that should be considered for harnesses are Open Code, obviously, and then we have Pi, and we have Cline, and we have Clear Code. And, for instance, Kilo Code was acquired by a company: Anaconda. As a big user of Python, I know that that's a pretty great acquisition for Kilo Code, and something to keep on the radar. So these are companies that are pouring money into these harnesses, and we don't want to discount them as something that we can't use and take advantage of. We have very vibrant open source contributions to Pi, and to Cline, which is also doing very well. And these are adopted by different companies. So all of these harnesses have a signal, a very clear signal of application and use, that we can't just disregard.

## Local AI and the Minimum Tool

And these go with the idea that we have these Chinese models and open-weight models, and the idea of doing local AI. The idea of not being able to work if Wi-Fi goes down. So even my dictating tools that I use, I have most of these set to local. Local models. So I can sort of get used to those. And I can switch back and forth between cloud-based models when I want to do some special work.

But now there is this idea that you cannot work without Wi-Fi. And even Wi-Fi being what it is today, I believe that, as human beings, we should have the least of requirements to do work, as we did back in the day when we used our own brains or our own eyes to do certain types of things. Let's just have a computer. And we shouldn't throw that out. We should still have the computer as the minimum tool that we need, but not access to Wi-Fi, not access to cloud services. Just the computer, which is what we would be able to do ourselves, and probably something that we don't want to consider just throwing out.

## You Can't Go All In on One

And if you just work with Claude Code or Codex or OpenAI, you're so susceptible to many different risks of impairing your ability to get work done, impairing your business, leaving you in a pickle. You can't just rely on one. You can't just go all in on one of these harnesses, on one of these models. Surely some of these companies are not going to go away anytime soon. But they could break, and these sorts of things do happen. So recently we had OpenAI sort of revoke subscription access from Cursor, and that's the real thing, my piece. If that's what people were using, now all of a sudden it doesn't work, and you're scrambling to figure out a different way to work.

And this doesn't happen if you embrace the plurality of these tools and already start working with these tools. You have nothing to lose from understanding the strength of each one of these tools, since it is such a centerpiece to how you do work. You should track them. You should understand how each works, and the commonality between the different tools.

## What the Framework Has Today

So today, this conceptual framework that I use works, obviously, with the context file. I have commands implemented as an artificial primitive, which is not available in all the different harnesses. Then we have skills and sub-agents, which is pretty standard. And then I have other additional improvements that I have introduced, like streaming agents. Streaming agents are agents that we set up on the fly using the streaming capabilities of the harnesses, and using Tmux-based sessions for speeding up new agents. So there are different ways to have these harnesses talk to each other, and I can use them for different orchestration strategies.

And then finally there's cloud. This is not a territory that I've covered. But cloud is another way that we don't have to be over-reliant on one of these companies and labs to do cloud computing for us, when we have the infrastructure for running it — chip infrastructure that we can run these subscriptions on. So that's not territory that I've covered yet, but that's planned in the long run. That is, we can do cloud orchestration of agents without having to rely on how they want it done for us, or having to rely on the services for it.

## Summary So Far

So in summary, what we said is that you don't want to become over-reliant on a single tool, a single harness, and a single model. Different harnesses and different models have different benefits for different tasks. And you want to hedge against any company, any lab, any harness, really: harness updates that may cause regressions, harnesses dropping features, supporting a feature temporarily and dropping it after you've become over-reliant on it. And that's why we hedge by using the commonalities amongst the different harnesses' functionalities. Those are strong signals that you're relying on established features that are not going away anytime soon.

And models. You want to use different models, as different models have different abilities, different benefits over different types of tasks. And also, you don't know which lab is coming out with the next best model. It's a bit of a race, and the labs take turns, and each lab is taking leaps forward. And one of these labs at some point might actually not be taking that longer, bigger leap than the usual. And you want to be able to be ready for that and jump on the lab that's leading the race, so that when you're able to use that lab, you're reaping the benefits of these efforts. And then you have all these people working on harnesses, companies pouring money into harnesses. Even if they're not pouring money into models, they're pouring money into harness development, and you want to be able to reap those benefits as well.

So that's the summary so far for having a conceptual framework that deals with these harnesses, in a way that lets you deploy and keep track of changes to your skills, your agents, your sub-agents, your definitions. Really, to be able to modify one harness and have these modifications be applicable to all the different harnesses. That's what it comes down to.

## A Harness Management System

We can call this sort of system a harness management system. I'm not going to call it a meta-harness, because that's not the case, but a harness management system. So you're still using a specific harness when you choose to, only that your modifications to this harness get propagated to the other different harnesses.

And on top of such a harness management system, once you attain this level of control, there's a series of other features and benefits that you can have. That's again all applicable to all the different harnesses, so you can start reaping from those as well.

### Isolation

So, isolation. We want to be able to have our source code, our application, our service, isolated from the harness, so we are able to switch back and forth with different harnesses. And we can make it such that the application that we're developing is not aware of which harness we are working on. So we abstract the harness away from the application, and that gives us this ability to switch between harnesses and attain the same sort of ability to work on these codebases.

With this isolation now, we can create these structures that allow us to keep the development of these harnesses following best engineering practices, such as keeping them dry, such as differentiating between specialized agents and generic agents. That is, not having a single context file for every single job that we do. So we're able to specialize.

### Agents, and Why They Are Not Sub-Agents

Sub-agents are something that we already share amongst the harnesses, and something that we can always add. If we have sub-agents, then the agent should be considered the main thread agent that the harness controls, orchestrates, and runs. Then we should be able to create different agents, and attach these different agents to different projects, and have different agents work on the same project. Because of isolation, we get to do that.

We get to have these agents — and I want to differentiate that from sub-agents. We get to have these agents, basically these sessions, main thread agents: different main thread agents that are specialized and purpose built.

If you walk through the progression here, we started with wanting to be able to work with different harnesses, and to develop with different harnesses as if we were developing with one harness. That caused us to go into the concept of isolation, and having our application code not be aware of what harnesses we are actually using. And that brought us to now being able to come up with specialized sub-agents, or specialized agents, for performing purpose-based tasks that are specific for the different purposes.

## The Four Pieces

And out of that, we have a structured way of doing that. We have a structure where we have a place that's common to all agents. We have the different agents. And then finally, we have a context structure that is specific to the projects that you're working on. So you have these four pieces: a commons location, a context location, an agents location, which is where the agents live, and then the supervised projects, which are the projects that are supervised by these different agents.

And this is the essence of Asterifold. I'm able to keep a growing infrastructure that's shared amongst all the different harnesses. And I'm able to quickly spin up different projects and attach different agents to them, and I'm able to manipulate these agents.

So I'm able to very flexibly start new projects, scaffold new projects with different agents, pick different agents, modify different agents. And so it's about manipulating the infrastructure that supports the agents: creating different agents and creating different projects, creating different views of the projects, and attaching purpose-based agents to these projects. So basically picking the right tool for the job, and using the tool in the right way to get the best results possible.

## Not Beholden to GitHub

Another benefit that we have is that we are building a system that is disjoint and uncoupled by nature. And that gives us the option not to rely on, for instance, GitHub so much.

And we're able to create these adapters. We are currently relying on Git for work trees. This framework does that, but it does not need to use GitHub. So much so that right now, if GitHub goes down again, like it has recently, we can, as of the date of this writing, just continue working locally and have work trees be created and so forth.

And I can work without Wi-Fi. And I can work by using local models, and I can work without GitHub by using local Git and a local Git repo. And so that gives us the ultimate flexibility to not be over-reliant on these services that keep our projects running today.

## Before We Finish Part One

Before we finish part one, I will wrap up by listing out a few more benefits that fall out of this framework, and that make for a very robust way to work, observing good practices in engineering with the development and the management of these harnesses.

### Portable Memory

So we get portable memory. Memory is not something new. There are different ways that people have been accomplishing this — the continuity between sessions. But for us, it's integral that we have continuity between sessions, because the idea is that I can start working with a harness for certain tasks and then switch between harnesses and go to another harness. So it's important that we are able to track the task that we're working on and all the progress that's been made. That's not necessarily novel, but something that's natively part of it: it's a necessity for us to have a seamless transition between different harnesses. This would obviously benefit anyone, even if we didn't have multiple harnesses, but it's an integral part of managing multiple harnesses.

### Agents and the Compiler

Within the efforts of managing different agents — which are not to be confused with harnesses — we should differentiate between harnesses and agents. You can think of an agent as being an instance of a harness session with its selected tooling, its selected tools and context. So in order for us to come up with different agents, we have built a compiler that allows us to easily manage these different agents. This allows us to build agents not just with different context, but obviously with different tooling, which is what makes up an agent. So we can look at the definition of an agent now being an instance of a harness that has a specific context and has a specific set of tools, powered by a specific model.

And that's going to be our definition, and that gives us, naturally, our definition of an agent: harness, context, tooling, and the driving model.

### Common Context and Specialized Context

And since we have these different agents built to be used with different sets of projects that share common context, it turns out that we have common context and we have specialized context. So if you look at our context, that's how it's sort of broken down. And we also may have some inner context from the agent itself.

So this comes from the ternary structure, where we have agent commons, we have agent context, and we have agent instance. So all these three bits, they may inject different context. And we may swap an agent for another, and then the only context that changes is the context that comes from the instance. Or we may take the same agent and apply it to a different project. So then we still have the common context and the agent context, but now we have a new specialized context in the project.

And what this gives us is a way to compose instructions and documentation. Much like how we keep code dry, we can also keep markdown dry. And that is a necessity that comes from having such a framework. Again, nothing novel, but a necessity for accomplishing what this conceptual framework aims to accomplish.

### External Tools and MCPs

As part of tooling, the other necessity that we have is not to reinvent the wheel for everything, and to use existing tooling, which means that we also need to be able to manage external tools, like external skills and MCPs. So those are, again, not necessarily a novel concept to add. But in the way that we compile tools, we can now compile both internal tools and external tools that make up an agent.

### Online and Offline

We have already touched on this, but I'll reiterate. The ability to work online and offline is something that becomes intrinsic. It becomes something that comes from this idea of being able to work with open models. Because we are able to work with open models, the rest of the stack should also natively support offline work, and this framework provides the necessary support. We already have the necessary support to get this sort of feature, to have that be an integral feature of this conceptual framework, where we are both able to work online and able to work offline.

### Task Engineering and Continuity

As we work with different harnesses and models, we understand the abilities of each model to be thorough and correct, and constrained. So task engineering and execution become an integral part of this framework, where we can standardize, to a certain extent, the level of completeness that each harness and model is able to deliver, by constraining the models and providing enough upfront context for tasks to be finalized and completed.

And when a harness and model fail to deliver that, we are able to provide continuity — so the agent can try again, or another session can pick up from where it left off. So this engineering of the task and engineering of the execution itself, coupled with the ability to have this continuity between sessions, is an integral part of this framework.

### Adding, Evaluating, and Removing Harnesses

Lastly, since we are working with multiple harnesses, it also becomes a necessity to have abilities to add new harnesses, evaluate new harnesses, and remove harnesses, such that it doesn't actually become such a rapture to try out new harnesses as they become available, or to remove support for them as we decide to retire them.

And that sort of wraps up the native benefits, which we can build on to arrive at other benefits. But this is the framework — the benefits that come from working with a conceptual framework like this.

## Smart Routing

Another very important feature that we may miss from not working with multiple models is smart routing. And smart routing is something that's currently supported by a couple of different harnesses that include Cursor and Kilo Code, where we're able to build out a recipe of different models and be cost efficient, leveraging the right model for the right task.

And this is only possible when we explore these different harnesses and leverage these different harnesses as part of our workflow. But never locking ourselves to any one of these. And while this feature is not available in all harnesses, this is something we should consider as we proceed with how we approach different tasks and different states of a task: either by manually selecting different harnesses and models for different bits and pieces of a task, or by using harnesses that already take advantage of this sort of smart routing feature embedded in some of these harnesses.

## Native Modes and Early Adoption

So in some of these harnesses, we have these special modes, like the debug mode that is native within the harness for both Kilo Code and Cursor. And these are things we can look into: replicating some of this behavior into other harnesses — but that we may not be able to do completely, because what these harnesses have now is native support for these modes.

And so going through all these harnesses is a great way to understand some of the things that we should be looking forward to: features that are not yet quite established across the other harnesses, but things that we may start to take advantage of early. So both things. We're able to know what features are really solidified and stable. And we can also be early adopters and take advantage of them in a way that does not compromise our workflows if support for any of these gets dropped. We can still take advantage of early features in a responsible way.
