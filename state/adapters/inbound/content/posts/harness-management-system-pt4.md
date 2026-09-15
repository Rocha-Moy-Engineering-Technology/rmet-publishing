---
title: 'Part 4: Choosing and Adopting Harness Capabilities'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## The Field Is Crowded Now

Now, in this day and age, we have some fierce competition amongst competitors, and different players joining the field. We're not just between Claude Code and Codex anymore. We have xAI and SpaceX with their Grok model and their harnesses, and Cursor. And then we have open-weight models, which can no longer be disregarded as things that don't have use for it. And we have a bunch of different harnesses that are being developed by some very talented people, and that's work that's going into these tools that can be useful if you know when to use each. Even though this may sound like an untrackable way of thinking about this problem, it's more about keeping your options open and not putting your eggs in a single basket.

So I need to be quite comfortable switching between Codex, or OpenAI, or Anthropic, or in this case xAI, if any of these suffer an outage that's not shared amongst other companies. And what if they do — what if all of these go down? So what about local AI? Local AI cannot be disregarded anymore as something of the future. And very soon, we will be able to be leveraging local AI with some reasonable power, especially as Apple rages on with local AI and they're betting on doubling down on it.

## The Other Harnesses

Other options that are out there that should be considered for harnesses are Open Code, obviously, and then we have Pi, and we have Cline, and we have Clear Code. And, for instance, Kilo Code was acquired by a company: Anaconda. As a big user of Python, I know that that's a pretty great acquisition for Kilo Code, and something to keep on the radar. So these are companies that are pouring money into these harnesses, and we don't want to discount them as something that we can't use and take advantage of. We have very vibrant open source contributions to Pi, and to Cline, which is also doing very well. And these are adopted by different companies. So all of these harnesses have a signal, a very clear signal of application and use, that we can't just disregard.

## What the Framework Has Today

So today, this conceptual framework that I use works, obviously, with the context file. I have commands implemented as an artificial primitive, which is not available in all the different harnesses. Then we have skills and sub-agents, which is pretty standard. And then I have other additional improvements that I have introduced, like streaming agents. Streaming agents are agents that we set up on the fly using the streaming capabilities of the harnesses, and using Tmux-based sessions for speeding up new agents. So there are different ways to have these harnesses talk to each other, and I can use them for different orchestration strategies.

And then finally there's cloud. This is not a territory that I've covered. But cloud is another way that we don't have to be over-reliant on one of these companies and labs to do cloud computing for us, when we have the infrastructure for running it — chip infrastructure that we can run these subscriptions on. So that's not territory that I've covered yet, but that's planned in the long run. That is, we can do cloud orchestration of agents without having to rely on how they want it done for us, or having to rely on the services for it.

## Smart Routing

Another very important feature that we may miss from not working with multiple models is smart routing. And smart routing is something that's currently supported by a couple of different harnesses that include Cursor and Kilo Code, where we're able to build out a recipe of different models and be cost efficient, leveraging the right model for the right task.

And this is only possible when we explore these different harnesses and leverage these different harnesses as part of our workflow. But never locking ourselves to any one of these. And while this feature is not available in all harnesses, this is something we should consider as we proceed with how we approach different tasks and different states of a task: either by manually selecting different harnesses and models for different bits and pieces of a task, or by using harnesses that already take advantage of this sort of smart routing feature embedded in some of these harnesses.

## Native Modes and Early Adoption

So in some of these harnesses, we have these special modes, like the debug mode that is native within — it's got native ramifications within the harness — for both Kilo Code and Cursor. And these are things we can look into: replicating some of this behavior into other harnesses — but that we may not be able to do completely, because what these harnesses have now is native support for these modes.

And so going through all these harnesses is a great way to understand some of the things that we should be looking forward to: features that are not yet quite established across the other harnesses, but things that we may start to take advantage of early. So both things. We're able to know what features are really solidified and stable. And we can also be early adopters and take advantage of them in a way that does not compromise our workflows if support for any of these gets dropped. We can still take advantage of early features in a responsible way.

## Adding, Evaluating, and Removing Harnesses

Lastly, since we are working with multiple harnesses, it also becomes a necessity to have abilities to add new harnesses, evaluate new harnesses, and remove harnesses, such that it doesn't actually become such a rapture to try out new harnesses as they become available, or to remove support for them as we decide to retire them.

And that sort of wraps up the native benefits, which we can build on to arrive at other benefits. But this is the framework — the benefits that come from working with a conceptual framework like this.
