---
title: 'Part 3: Context, Continuity, and Offline Work'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## Common Context and Specialized Context

And since we have these different agents built to be used with different sets of projects that share common context, it turns out that we have common context and we have specialized context. So if you look at our context, that's how it's sort of broken down. And we also may have some inner context from the agent itself.

So this comes from that, for the tree, the trident of the ternary structure, where we have agent commons, we have agent context, and we have agent instance. So all these three bits, they may inject different context. And we may swap an agent for another, and then the only context that changes is the context that comes from the instance. Or we may take the same agent and apply it to a different project. So then we still have the common context and the agent context, but now we have a new specialized context in the project.

And what this gives us is a way to compose instructions and documentation. Much like how we keep code dry, we can also keep markdown dry. And that is a necessity that comes from having such a framework. Again, nothing novel, but a necessity for accomplishing what this conceptual framework aims to accomplish.

## External Tools and MCPs

As part of tooling, the other necessity that we have is not to reinvent the wheel for everything, and to use existing tooling, which means that we also need to be able to manage external tools, like external skills and MCPs. So those are, again, not necessarily a novel concept to add. But in the way that we compile tools, we can now compile both internal tools and external tools that make up an agent.

## Portable Memory

So we get portable memory. Memory is not something new. There are different ways that people have been accomplishing this — the continuity between sessions. But for us, it's integral that we have continuity between sessions, because the idea is that I can start working with a harness for certain tasks and then switch between harnesses and go to another harness. So it's important that we are able to track the task that we're working on and all the progress that's been made. That's not necessarily novel, but something that's natively part of it: it's a necessity for us to have a seamless transition between different harnesses. This would obviously benefit anyone, even if we didn't have multiple harnesses, but it's an integral part of managing multiple harnesses.

## Local AI and the Minimum Tool

And these go with the idea that we have these Chinese models and open-weight models, and the idea of doing local AI. The idea of not being able to work if Wi-Fi goes down. So even my dictating tools that I use, I have most of these set to local. Local models. So I can sort of get used to those. And I can switch back and forth between cloud-based models when I want to do some special work.

But now there is this idea that you cannot work without Wi-Fi. And even Wi-Fi being what it is today, I believe that, as human beings, we should have the least of requirements to do work, as we did back in the day when we used our own brains or our own eyes to do certain types of things. Let's just have a computer. And we shouldn't throw that out. We should still have the computer as the minimum tool that we need, but not access to Wi-Fi, not access to cloud services. Just the computer, which is what we would be able to do ourselves, and probably something that we don't want to consider just throwing out.

## Not Beholden to GitHub

Another benefit that we have is that we are building a system that is disjoint and uncoupled by nature. And that gives us the option not to rely on, for instance, GitHub so much.

And we're able to create these adapters. We are currently relying on Git for work trees. This framework does that, but it does not need to use GitHub. So much so that right now, if GitHub goes down again, like it has recently, we can, as of the date of this writing, just continue working locally and have work trees be created and so forth.

And I can work without Wi-Fi. I can work using local models. I can work without GitHub by using local Git and a local Git repo. And so that gives us the ultimate flexibility to not be over-reliant on these services that keep our projects running today.

## Online and Offline

We have already touched on this, but I'll reiterate. The ability to work online and offline is something that becomes intrinsic. It becomes something that comes from this idea of being able to work with open models. Because we are able to work with open models, the rest of the stack should also natively support offline work, and this framework provides the necessary support. We already have the necessary support to get this sort of feature, to have that be an integral feature of this conceptual framework, where we are both able to work online and able to work offline.

## Task Engineering and Continuity

As we work with different harnesses and models, we understand the abilities of each model to be thorough and correct, and constrained. So task engineering and execution become an integral part of this framework, where we can standardize, to a certain extent, the level of completeness that each harness and model is able to deliver, by constraining the models and providing enough upfront context for tasks to be finalized and completed.

And when a harness and model fail to deliver that, we are able to provide continuity — so the agent can try again, or another session can pick up from where it left off. So this engineering of the task and engineering of the execution itself, coupled with the ability to have this continuity between sessions, is an integral part of this framework.
