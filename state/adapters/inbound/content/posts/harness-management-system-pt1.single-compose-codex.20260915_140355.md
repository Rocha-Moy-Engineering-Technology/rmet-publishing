---
title: 'Agentic development with multiple harnesses and models: A hedge against the AI chaos. Part-I'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## Yet another UI?

Let’s get something out of the way before we start. This is not about creating another UI to interface with different models or harnesses. Yet another UI, right?

It’s about harnessing what already exists: the tools that companies are pouring money and person-hours into. This is a conceptual framework that defines a structure and how its parts interact so we can use different harnesses efficiently and effectively, without waste.

The motivation is straightforward. Labs and companies are investing heavily in this race toward AGI. We don’t know which companies will make it. Perhaps several will. Along the way, though, we want to benefit from their leaps forward without getting stuck with a single tool.

We also don’t want an outage, a lost Wi-Fi connection, or even a power outage to stop our work. We live in a world of batteries and laptops. We should still be able to get useful work done under different conditions: optimally when we can, and in best-effort mode when we cannot.

I don’t want to become so reliant on these companies that they dictate how I work. It’s easy to assume that, because of how these harnesses are built, we no longer have choices or cannot tune them to suit us. That’s just not the case. There is a lot we can do.

## The outage that made the problem concrete

At the start, I mostly relied on Claude Code. I was already concerned about becoming over-reliant on it, so I kept Codex nearby. If Claude Code’s services were interrupted, I needed another way to work.

By then, Claude Code had become central to how quickly I could move and get work done. My clients weren’t going to accept “Claude Code isn’t working” as an excuse. This was especially relevant at the beginning of this agentic era, when the use of these tools wasn’t quite as apparent.

I’m quite comfortable with anyone I work with using their tools of choice: the tools they feel most comfortable, confident, and efficient with. But that also means being prepared when those tools become unavailable.

Then Claude Code had an outage, and work stopped.

I had anticipated that this would happen, so I switched to Codex. I hadn’t done any significant work with it up to that point. To my pleasant surprise, it had improved. As a harness, it still wasn’t up to snuff with Claude Code, which remained the superior choice for me at the time. As soon as the services were restored, I went back.

But that experience settled something: I couldn’t rely on one company, one service, or one tool, especially when that tool had become the centerpiece of how work got done.

I started developing a way of working that made sense for Codex as well.

## Shared primitives and keeping Markdown dry

The engineer in me understood that we needed a way to ensure that the commands, which were still a thing when this. Commands were still a thing when this work began. Some popular harnesses have since done away with them, although Claude Code still retains them as of this writing.

There were shared primitives to build on: skills, commands at the time, and sub-agents. Sub-agents weren’t well supported when I started, but I knew they were going to be a thing. I began with the primitives that were shared, understood, and implemented across harnesses.

Since then, I’ve progressively implemented them within a conceptual framework that lets me create a primitive once and deploy it to different harnesses. Think of it as keeping things dry. Keeping my Markdown dry.

I write a command once, and it gets deployed across harnesses, taking their differences and solitudes into account.

That was the start of what I now call Asterifold. The name comes from A star, the classical AI search method that uses heuristics to improve conversions, and “fold,” from “many”: in this case, many harnesses and agents.

## Keeping our options open

The field is no longer just Claude Code and Codex. We have xAI and SpaceX with their Grok model and harnesses, Cursor, and open-weight models that can no longer be disregarded as having no use.

Talented people are building these tools. Their work can be useful if we understand when to use each one. Keeping track of all this may sound difficult, but the principle is familiar: keep your options open, and don’t put all your eggs in one basket.

I need to be comfortable switching between Codex and other tools from OpenAI, Anthropic, or xAI when one company has an outage that the others don’t share.

And what if they all go down?

Local AI can no longer be dismissed as something for the future. Very soon, we should be able to use it with reasonable power, especially as Apple pushes ahead and doubles down on local AI. We need to keep that option open.

### Models and harnesses both matter

Some models have advantages over others for particular tasks. I probably don’t need to convince you of that. But the same applies to harnesses, especially when a harness and its models are closely coupled.

I wouldn’t choose a single harness for all models, even if I could. We have to concede that Claude Code is optimized for Anthropic’s models, Codex for OpenAI’s, and Cursor and Grok tooling for xAI’s.

There is a matrix of choices here. Remaining agnostic and protecting ourselves against temporary service failures are part of it, but so is being effective.

These are tools. Very useful tools, but tools nonetheless. We should pick the best tool for the job.

Other harnesses worth considering include OpenCode, Pi, Cline, and Clear Code. Kilo Code was acquired by Anaconda. As a big Python user, I see that as a great acquisition for Kilo Code and a reason to keep it on my radar.

Companies are putting money into these harnesses. Pi has vibrant open-source contributions. Cline is also doing well, with adoption by different companies. These are clear signals of application and use. We shouldn’t disregard them.

The same goes for Chinese models, open-weight models, and local AI.

### A computer should still be enough

Most of my dictation tools are set to local models so I can get used to working that way. I can switch to cloud-based models when I want to do some special work.

Even with Wi-Fi being what it is today, I believe we should have the least of requirements to do work. We used to rely on our own brains and eyes for many of these tasks. A computer should still be the minimum tool we need, without also requiring Wi-Fi or access to cloud services.

We shouldn’t throw that out. We shouldn’t give up the ability to work with just a computer.

If you rely entirely on Claude Code, Codex, or OpenAI, you expose your ability to get work done—and your business—to several risks. You can end up in a pickle. You can’t simply go all in on one harness or model.

Some of these companies surely won’t disappear anytime soon. They could fail, but that isn’t the only risk. These disruptions do happen. Recently, OpenAI revoked subscription access from Cursor. That’s the real thing, my piece. If that was how you worked, suddenly it no longer worked, and you were scrambling for an alternative.

You avoid that scramble by embracing the plurality of these tools and already working with them. You have nothing to lose by understanding their strengths when they play such a central role in your work. Track them. Understand how they work and what they have in common.

### The race keeps moving

Different models bring different abilities to different tasks, and we don’t know which lab will produce the next best model. The labs take turns making leaps forward. At some point, one of these labs might not be taking that longer, bigger leap than usual.

I want to be ready to switch to whichever lab is leading the race and benefit from its work.

The same applies to harness development. Companies don’t have to build models to invest heavily in harnesses. We should be able to benefit from those efforts too.

We also need to hedge against harness updates that introduce regressions or remove features. A feature can be supported temporarily and then dropped. Building on common functionality across harnesses gives us a stronger signal that we’re relying on established features that won’t disappear anytime soon.

## A harness management system

Today, my framework works with the context file, commands implemented as an artificial primitive where necessary, skills, and sub-agents.

I’ve also introduced streaming agents: agents set up on the fly using harness streaming capabilities and tmux-based sessions to spin up new agents. These provide ways for harnesses to talk to each other and support different orchestration strategies.

At its core, the framework lets me deploy and track changes to skills, agents, sub-agents, and their definitions. I can make a modification for one harness and have it apply to the others.

I’m not going to call it a meta-harness, because that’s not the case. I call it a **harness management system**. You still use a specific harness when you choose to. The system lets your modifications propagate to the other harnesses.

Once you have that level of control, other capabilities follow.

### Isolating the application from the harness

We want our source code, application, or service to be isolated from the harness so we can switch between harnesses. The application should not need to know which harness we’re using.

Abstracting the harness away from the application lets us move between harnesses while retaining the ability to work on the same codebase.

That isolation also lets us structure the harness infrastructure according to good engineering practices. We can keep it dry and distinguish generic agents from specialized ones, instead of using a single context file for every job.

### Agents are not sub-agents

Sub-agents are already a shared primitive across harnesses. But I also want to distinguish them from the agents running in the main thread: the sessions that the harness controls and orchestrates.

We should be able to create different main-thread agents, attach them to different projects, and have different agents work on the same project. Isolation makes that possible.

These agents can be specialized and purpose-built. The progression matters: we started by wanting to develop with different harnesses as though we were developing with one. That led to isolation, so our application code would not depend on the harness. From there, we could create specialized agents and sub-agents for particular purposes.

### Four pieces of the structure

The framework has four pieces:

- **Commons:** a location for what is shared across agents.
- **Context:** a location for the context specific to the projects we’re working on.
- **Agents:** a location for the agents themselves.
- **Supervised projects:** the projects those agents supervise.

This is the essence of Asterifold. I can maintain a growing infrastructure shared across harnesses, quickly spin up projects, and attach different agents to them.

I can scaffold projects, choose or modify agents, create different views of the projects, and attach purpose-built agents to those views. It’s about manipulating the infrastructure that supports agents and projects so we can pick the right tool, use it well, and get the best results possible.

## Independence from the services around us

A system that is disjoint and uncoupled by nature also gives us the option to rely less on services such as GitHub.

We can create adapters. The framework currently relies on Git for worktrees, but it doesn’t need GitHub. As of this writing, if GitHub goes down again, as it has recently, we can continue working locally, creating worktrees and carrying on.

I can work without Wi-Fi. I can work using local models. I can work without GitHub by using local Git and a local Git repository.

That gives us the flexibility to avoid becoming over-reliant on the services that keep our projects running today.

Cloud is another possibility, although it is territory I haven’t covered yet. We don’t have to rely entirely on these companies and labs to determine how cloud computing is done for us. When we have the infrastructure for running, chip infrastructure that we can run these subscriptions on.

Cloud orchestration of agents is a longer-term plan: being able to orchestrate them without depending on how those companies want it done or on their services for that orchestration.

## Capabilities that follow from the framework

Before finishing part one, I want to cover a few more benefits that follow from managing harnesses this way and observing good engineering practices.

### Portable memory and continuity

Memory is not new. People have used different approaches to continuity between sessions. For this framework, though, continuity is integral.

I might start a task in one harness and move to another. We need to track the task and all the progress made so that the transition can be seamless.

That would be useful even with a single harness. With multiple harnesses, it is a necessity and a native part of the framework.

### A compiler for agents

Managing agents is different from managing harnesses. An agent is an instance of a harness session with selected context and tools, powered by a particular model.

That gives us our definition:

**Agent = harness, context, tooling, and driving model.**

We’ve built a compiler to manage these agents. It lets us build agents with different context and different tooling, which together make up the agent.

These agents work with different sets of projects that share common context. Some context is common, some is specialized, and some comes from the agent itself.

That leads to a three-part structure: **agent commons, agent context, and agent instance**. Each can contribute context.

We can swap one agent for another and change only the context supplied by the instance. Or we can take the same agent to a different project, retain the common and agent context, and introduce the new project-specific context.

This gives us a way to compose instructions and documentation. Just as we keep code dry, we can keep Markdown dry. Again, it isn’t a novel idea. It is a necessity for what this framework aims to accomplish.

### Internal and external tools

We don’t want to reinvent the wheel for every tool. We need to use existing tooling, which means managing external skills and MCPs as well.

Adding external tools is not novel either. But within the way we compile tooling, we can compile both the internal and external tools that make up an agent.

### Online and offline work

The ability to work online and offline becomes intrinsic to the framework.

If we can use open models, the rest of the stack should also support offline work natively. The framework already provides the necessary support to make both online and offline work an integral capability.

### Task engineering and execution

Working with different harnesses and models exposes their different abilities to be thorough, correct, and constrained.

Task engineering and execution therefore become integral parts of the framework. By constraining models and providing enough context upfront, we can standardize, to a certain extent, the level of completeness each harness and model delivers.

When a harness and model fail to deliver that level of completeness, continuity lets the agent try again or another session pick up where it left off.

Engineering the task, engineering its execution, and preserving progress between sessions belong together.

### Adding, evaluating, and retiring harnesses

A system for multiple harnesses also needs ways to add, evaluate, and remove them.

Trying a new harness or retiring support for one should not become such a rapture. These operations need to be part of how the framework works so we can explore new harnesses as they become available and remove them when we decide to retire them.

These are native benefits of the framework, and they give us a basis for building further capabilities.

## Smart routing and early features

Another important feature we may miss by working with only one model is smart routing. Cursor and Kilo Code already support it.

We can build a recipe of models and use the right model for each task in a cost-efficient way. Exploring different harnesses and making them part of our workflow gives us access to these capabilities without locking us into any one tool.

Smart routing isn’t available in every harness. We should still consider it when deciding how to approach a task and its different states. We can manually select harnesses and models for different parts of the work, or use a harness with smart routing built in.

Some harnesses also have special modes. Kilo Code and Cursor have debug modes with native support inside the harness. We can explore replicating some of that behavior elsewhere, although we may not be able to reproduce it completely because of that native support.

Working across harnesses helps us recognize both established features and emerging ones. We can see which capabilities are solidified and stable, and which newer features are worth adopting early.

That lets us take advantage of new capabilities responsibly, without compromising our workflows if support for them is later dropped.
