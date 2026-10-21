Friction Log: Building for Vega OS Is Not the Same as Running on Vega OS
Project: Vid30 — The AI Streaming OS for Smart TVs
Hackathon: Amazon Build, Ship, Shape 2026
Area: Vega OS development workflow and runtime validation
Severity: High — end-to-end validation blocked

Summary
My goal was to build Vid30, an AI-powered streaming experience for Smart TVs, using Amazon’s React Native multi-TV application sample as the starting point.

I began development on a Windows PC, despite the Vega OS development workflow being more naturally suited to Linux or macOS environments. Rather than abandoning the target platform, I investigated the tooling, adapted my environment, and moved the build process to an Ubuntu environment on AWS EC2.

I eventually generated a Vega package successfully. However, I could not complete the final simulator/runtime validation within the hackathon timeframe.

The key lesson: a successful build does not prove that an application runs on the target platform.

What I attempted
My objective was to validate a repeatable end-to-end workflow:

Start from Amazon’s React Native multi-TV application sample.
Configure the development environment for Vega OS.
Build the Vid30 application package.
Discover or launch a supported simulator.
Install and launch the package.
Verify the application at runtime.
What happened
I encountered friction while investigating the environment requirements and the Vega command-line workflow. Some attempted CLI commands or arguments were rejected by the installed tooling, making it harder to establish the correct simulator and runtime procedure.

I moved the build work to Ubuntu on AWS EC2 and successfully generated a Vega package. The build process therefore made progress, but I did not complete the final step of proving that Vid30 launched and worked in a supported Vega OS runtime.

I deliberately kept these outcomes separate:

Build: a Vega package was generated successfully.
Runtime: end-to-end application execution was not validated.
User experience: the complete Smart TV experience therefore remains to be verified.
Expected vs. actual result
Expected: A documented, repeatable workflow covering environment setup, build, simulator discovery, installation, launch, and runtime verification.

Actual: Package generation was achievable after adapting the development environment, but the simulator/runtime workflow remained unresolved during the available development time.

Workaround
I used Ubuntu on AWS EC2 for the build work and prioritized Vid30’s web MVP for faster iteration on the AI discovery experience.

This allowed the project to progress without claiming that the Vega runtime had been validated.

Severity and impact
Severity: High.

The issue blocked end-to-end validation on the intended Smart TV platform within the hackathon timeframe. It did not prevent progress on Vid30’s AI discovery backend, recommendation logic, catalog, or web prototype, but it limited what I could demonstrate as a verified Vega OS experience.

Actionable suggestion
A version-specific, end-to-end Vega OS quick-start guide would make this workflow easier to reproduce.

Ideally, it would include:

Supported operating systems and environment prerequisites.
The exact compatible Vega tooling version.
Verified build commands and expected output.
Commands to discover available simulators and launch one.
Package installation and application launch instructions.
A minimal runtime verification checklist.
Troubleshooting guidance for rejected CLI commands and unsupported arguments.
The documentation should clearly distinguish build commands from simulator and runtime commands, with examples verified against the stated tooling version.

Takeaway
This was not a failure to generate a package. It was a gap between successful packaging and verified execution.

For Vid30, the next milestone is to complete that last mile: launch the application in a supported Vega OS runtime, verify the core experience, and document the workflow so it can be repeated.

Build Vega ≠ Runtime Vega.