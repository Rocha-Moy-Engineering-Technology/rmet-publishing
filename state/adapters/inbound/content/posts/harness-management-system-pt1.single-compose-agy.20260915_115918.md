---
title: 'Agentic development with multiple harnesses and models: A hedge against the AI chaos. Part-I'
description: 'A conceptual framework for managing multiple harnesses and models'
publishedAt: 2026-09-04
draft: true
---

## Beyond Yet Another UI: Harnessing Existing Investment

Let's get something out of the way before we start: this is not about building yet another user interface to sit in front of different models or different harnesses. It is about leveraging and harnessing what tech companies and research labs are already pouring massive capital and person-hours into developing.

This project does not attempt to create something entirely new from scratch. Instead, it introduces a conceptual framework that defines a clear operational structure and interaction model. Its purpose is to optimize how we utilize these diverse harnesses—efficiently, effectively, and without waste.

## The Philosophy of Resilience and Agility

### Hedging Against Chaos in the Race to AGI

The driving principle here is straightforward: companies and frontier labs are pouring enormous capital and human effort into the race toward Artificial General Intelligence (AGI). We want to capitalize on their breakthroughs while staying prepared for the inevitable chaos of that competition. It remains uncertain which lab will emerge on top, and multiple players may succeed simultaneously.

As these organizations make major technical leaps, we need to absorb their advancements without locking ourselves into a single vendor's ecosystem. We cannot afford to be incapacitated when a cloud service suffers an outage, or when local Wi-Fi or electricity fails. In a world of battery-powered laptops, developers should remain productive under varying conditions—operating at peak capacity when fully connected, and gracefully dropping into a robust best-effort mode when offline.

We must also hedge against harness updates that introduce regressions, or situations where a vendor temporarily supports a feature only to drop it later after developers have grown over-reliant on it. Anchoring our workflows to the commonalities across different harnesses provides a strong signal that we are depending on established features that are not going away anytime soon.

We must never become so over-reliant on any single vendor that they dictate our workflow. There is a prevailing misconception that because harnesses are built and coded in specific ways, developers are stripped of agency and cannot tune them to their needs. That simply is not the case. There is a great deal we can do to structure these tools so they serve us with maximum efficacy.

### The Offline Imperative: Minimal Operational Requirements

Local AI can no longer be dismissed as something of the distant future. Very soon, we will be able to leverage local AI with substantial power, especially as Apple moves aggressively into local AI and doubles down on local models.

Working with open-weight models naturally leads to an essential realization: the rest of our development stack must natively support offline operation. A human engineer should require minimal external dependencies to perform their work—much like in earlier eras when developers relied strictly on their own brains, eyes, and local machines.

A laptop should represent our baseline operational requirement, not continuous cloud connectivity or uninterrupted Wi-Fi. For example, my own dictation tooling is configured to run primarily on local models; I switch to cloud-hosted models only when specialized tasks demand it. Relying entirely on a single hosted tool—whether Claude Code, Codex, or OpenAI APIs—leaves a developer vulnerable to service disruptions, corporate policy shifts, or account lockouts that can halt business operations.

We saw this dynamic clearly when OpenAI abruptly restricted subscription access from Cursor, leaving developers who depended solely on that integration scrambling for alternatives. Such disruption does not happen if you proactively embrace a plurality of tools, study their shared mechanisms, and incorporate multiple runtimes into your daily workflow.

## The Catalyst: From Single-Vendor Dependency to Multi-Harness Reality

### An Outage at the Centerpiece

When I first began working in this modality, I relied predominantly on Claude Code to do my work. Yet even then, I worried about the risks of over-reliance and kept OpenAI's Codex close at hand as a fallback. I knew that if Claude Code suffered a service interruption, my clients would not accept a vendor outage as an excuse for missed deliverables—particularly in the early days of the agentic era, when these workflows were still novel.

My view on collaboration has always been pragmatic: I am honestly quite comfortable with anyone working alongside me using whatever tools make them most confident, comfortable, and efficient.

The inevitable eventually occurred: Claude Code experienced an outage, and work ground to a halt. Because I had anticipated this risk, I immediately switched my active work to Codex. Although I had not yet used Codex for substantial production tasks, I was pleasantly surprised to find it had improved, even if it was not quite up to snuff with Claude Code as a harness at the time. Claude Code remained my preferred choice once its services returned, but that incident permanently reshaped my thinking. I realized I could never again permit a single company, service, or tool to become an irreplaceable centerpiece of my engineering workflow.

### Primitives, Portability, and Keeping Markdown DRY

From that moment on, I began designing workflows that functioned just as naturally from the perspective of Codex as they did in Claude Code. The engineer in me recognized that we needed to identify the primitives shared across different harness implementations. Focusing on the commonalities among different harnesses gives us a strong signal that we are relying on established features rather than temporary additions that could disappear in the next update.

At the time, those shared primitives included commands, skills, and subagents:

- **Commands**: While several popular harnesses have since phased out commands, Claude Code still retains them as of this writing. To bridge this gap across the ecosystem, I implemented commands as an artificial primitive in Sterifold, ensuring they remain available even in harnesses that lack native support.
- **Skills**: Portable, task-oriented capabilities that have become standard across multiple runtimes.
- **Subagents**: Although nascent and inconsistently supported early on, their long-term importance across the ecosystem was obvious.

I began progressively implementing these shared primitives within a unified conceptual framework. The architecture adheres strictly to the DRY principle ("Don't Repeat Yourself") applied to documentation and prompt definitions—specifically, keeping our Markdown DRY. We author a command or skill definition once, and the framework deploys it across target harnesses while automatically handling the idiosyncrasies, behavioral differences, and structural nuances among them.

### The Genesis of Sterifold

This architectural pattern gave birth to what I call **Sterifold**. The name reflects two foundational concepts:

- **A\*** (A-star): The classical artificial intelligence search algorithm that uses heuristic estimates to accelerate convergence toward an optimal path.
- **Fold**: The manifold nature of managing and orchestrating multiple harnesses and agents across diverse environments.

Sterifold ensures that as our shared infrastructure expands, it remains portable across all supported harnesses, allowing developers to spin up projects, attach specialized agents, and manipulate configurations with minimal friction.

## The Tooling Matrix: Specialization and Ecosystem Coupling

### Harness-Model Affinity

In the current landscape, intense competition is driving rapid innovation across frontier labs and open-source communities. We are no longer choosing merely between Claude Code and Codex; we have xAI and SpaceX with their Grok model and harnesses, Cursor, and a growing roster of capable Chinese models and open-weight models that can no longer be disregarded.

Each model brings distinct strengths to specific classes of tasks, and the same principle applies to harnesses. Crucially, harnesses are tightly coupled to their creators' underlying models:

- Anthropic's Claude Code is optimized for Anthropic models.
- OpenAI's Codex is optimized for OpenAI models.
- Harnesses such as Cursor or tools tailored for xAI are similarly optimized for their respective model ecosystems.

Forcing a single harness to drive every model—even when technically feasible—neglects this native synergy. Maintaining agility means keeping our options open: developers must be comfortable moving between Anthropic, OpenAI, xAI, or local runtimes whenever an outage occurs or a particular task demands a specialized pairing. Ultimately, these are tools. They are powerful tools, but tools nonetheless, and we should always select the best tool for the specific job.

### The Expanding Field: Open-Source and Enterprise Signals

Beyond the dominant proprietary players, the broader harness ecosystem offers vital alternatives that should be considered:

- **OpenCode**: An obvious harness option that should be on our radar.
- **Pi**: A harness with very vibrant open-source contributions.
- **Cline**: Another harness that is doing very well, with vibrant open-source contributions and adoption by different companies.
- **Kilo Code**: A harness recently acquired by Anaconda. As a big user of Python myself, I know that this is a great acquisition for Kilo Code and something to keep firmly on our radar.

These harnesses provide clear signals of real-world application and active industry investment. When combined with local execution, open-weight models, and offline tooling, they ensure that developers maintain an uncompromised ability to ship software regardless of external circumstances.

## Architecture of a Harness Management System

Sterifold is best understood not as a "meta-harness," but as a **harness management system**. Developers still work directly within their harness of choice, but any improvements, tooling enhancements, or structural modifications made to one environment automatically propagate across the others.

### Strict Isolation: Decoupling Applications from Runtimes

The cornerstone of this framework is strict architectural isolation: the application, service, or codebase under development is completely decoupled from the AI harness being used. The application source code contains no awareness of, or dependency upon, any specific harness runtime.

By abstracting the harness away from the codebase, developers can alternate between different harnesses on the same project without altering application logic or leaving runtime-specific artifacts behind.

### Streaming Agents and Tmux Orchestration

To expand beyond baseline primitives, I introduced streaming agents into the framework. These are agents configured on the fly using the native streaming capabilities of the harnesses, combined with tmux-based sessions to accelerate launching new agents.

This setup provides flexible mechanisms for different harnesses to communicate directly with one another, unlocking sophisticated multi-harness orchestration strategies.

### The Structural Hierarchy: Commons, Context, Agents, and Projects

To maintain clean separation of concerns, Sterifold organizes work into four distinct structural layers:

1. **Commons**: The shared infrastructure location common to all agents and accessible across all harnesses.
2. **Context**: The location containing operational and project context specific to the projects being developed.
3. **Agents**: The location where specialized, main-thread agent definitions live.
4. **Supervised Projects**: The project codebases actively supervised and modified by these agents.

### The Context Trident: Composable Prompts and Documentation

Rather than burdening every task with a single monolithic context file, Sterifold separates generic capabilities from specialized instructions through a ternary context architecture (the context trident):

- `agent_commons`: Global context shared across all agents and environments.
- `agent_context`: Specialized operational context specific to the project.
- `agent_instance`: Dedicated inner context private to the specific agent instance.

This tiered hierarchy allows dynamic composition:

- Swapping one agent for another modifies only the instance-level context, preserving the common baseline.
- Applying an existing agent to a new project swaps only the project context while retaining the agent's core competencies and common guidelines.

Just as good software engineering keeps application code modular and DRY, the context trident keeps Markdown instructions composable and reusable across multiple runtimes.

### Defining the Agent: Harness, Context, Tooling, and Model

Within this system, we strictly distinguish between a *harness* and an *agent*:

- A **harness** is the external software environment (such as Claude Code, Codex, or Cursor) that orchestrates execution.
- An **agent** is a concrete instance of a harness configured with dedicated context and specific tooling, powered by a chosen model.

An agent is therefore defined by four core components:

$$\text{Agent} = \text{Harness} + \text{Context} + \text{Tooling} + \text{Model}$$

Main-thread agents run primary interactive sessions, while subagents handle modular, delegated subtasks. This distinction allows us to instantiate multiple specialized, purpose-built agents and attach them flexibly across supervised projects.

## Engineering Resilience: Continuity, Compilation, and Lifecycle

### Portable Memory and Session Continuity

Transitioning smoothly between different harnesses requires reliable session continuity. While session memory is not an entirely new concept, cross-harness continuity is an absolute operational necessity for Sterifold.

Because a developer may initiate a task in one harness and complete it in another, the framework must track active tasks, recorded decisions, and incremental progress in a runtime-agnostic manner. This portability guarantees that any harness can resume a workflow exactly where a previous session left off.

### Unified Tool Compilation: Internal and External Tooling

To manage diverse agent configurations effortlessly, Sterifold incorporates a dedicated tool compiler. Rather than reinventing existing utilities, the compiler integrates both internal and external capabilities:

- **Internal Tools**: Internally defined tools such as commands and skills built within the framework.
- **External Tools**: Third-party skills and Model Context Protocol (MCP) servers.

The compiler packages these resources alongside selected context files, producing coherent, fully equipped agents ready for immediate deployment.

### Local Worktrees and Cloud Independence

Sterifold is designed as a disjoint, uncoupled system that avoids hard dependencies on third-party cloud infrastructure like GitHub.

The framework interfaces with Git worktrees locally through dedicated adapters. If GitHub experiences an outage—as has occurred recently—developers can continue branching, building, and committing locally without disruption. Coupled with local Git repositories, offline models, and laptop battery power, Sterifold provides complete operational autonomy when cloud services falter.

Looking forward, we also envision runtime-independent cloud orchestration. While not yet covered in our current implementation, this planned long-term capability will allow developers to run agent workloads across cost-effective compute infrastructure without submitting to vendor-mandated cloud agent platforms.

### Task Engineering and Constraint Standardization

Because different models exhibit varying levels of thoroughness, precision, and adherence to instructions, Sterifold treats task engineering and execution as essential structural disciplines.

The framework standardizes output quality by establishing rigorous upfront context, explicit constraints, and clear completion criteria. When a model or harness stumbles or fails to deliver, session continuity allows the developer or an alternate agent session to resume the task and drive it to completion.

### Smart Routing, Lifecycle Management, and Responsible Early Adoption

Finally, working across multiple harnesses unlocks advanced capabilities:

- **Harness Lifecycle Management**: Standardized procedures to evaluate, onboard, and retire harnesses cleanly, ensuring that exploring emerging tools or dropping obsolete runtimes does not disrupt existing projects.
- **Smart Routing**: Harnesses like Cursor and Kilo Code feature smart model routing, allowing workflows to dynamically pair subtasks with the most cost-effective or capable model. Sterifold enables developers to leverage smart routing natively where supported, or orchestrate model selection manually when operating in other environments.
- **Responsible Early Adoption**: Harnesses frequently introduce proprietary features, such as the specialized native debug modes found in Cursor and Kilo Code. Sterifold allows developers to evaluate these native modes early and explore replicating their behavioral patterns into other harnesses where viable. If a vendor alters or drops support for an experimental feature, our core workflow remains fully insulated and intact.
