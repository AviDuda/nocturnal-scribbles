---
title: "Jujutsu: ADHD Punisher"
date: 2026-08-12
tags:
  - dev
  - adhd
slug: jujutsu-adhd-punisher
description: jujutsu version control system is kicking dopamine out of me, and that feels wrong.
draft: false
---
I'm trying and continuously fighting with [jujutsu](https://www.jj-vcs.dev/) (jj), a git-backed version control system, for two weeks now. What I'm finding out is that it isn't very friendly towards my ADHD brain, and I'm daring to say it's hostile.

I don't want this to sound like I hate jujutsu (and definitely not the authors!). It's extremely interesting and it made me curious how it works for 2 weeks. It just doesn't work with my brain. At all.

# Mutating when not looking

The *worst* thing about jj is how it does magic things while I don't specifically request them.  
jj auto-snapshots everything into the current change. This completely goes against my gazillion unrelated changes I usually have in a repo which go in different commits (I get distracted a lot). I can still commit a subset, but it feels like jj doesn't want me to.  
jj auto-rebases. I lost the commits so many times when I thought they would just change order. Nope, they are suddenly in a separate tree, somehow.  
jj auto-abandons empty changes. So you are telling me the change is there at one point and then it disappears?  
jj's sign-on-push rewrites my commit so it changes the date when it was committed. I thought this would be a nice feature to always ensure signing on push[^forgor], but nope. It. Changes. Every. Commit.  
My life is full of decision fatigue. The last thing I want from a VCS is to give me *more decisions* and more things to keep track of.  
Git only changes when I tell it to. jj changes when I blink. (And sometimes not, because I need to run a jj command to sync changes. Bizarre.)

# Object permanence? What's that, can I eat it?

Git is simple. You commit something, it stays put until you start doing a rebase.  
Jujutsu? Not so much. A jj change keeps morphing - same change ID, new content, new hash, new committer, shifted place in the graph. It's stable just like my life: Same[^same] old me, everything is somehow different all the time.

# Invisible progress? Time is fake, anyway

I *need* dopamine. I do *not* get dopamine when I see how the commit was "committed" 3 days ago just because I started the change via `jj new` (or just throwing stuff at the already created empty change) a few hours or days ago (or months when not touching some projects), and committed it now. Time is a social construct, but come on, starting work on something and claiming it as "I made this at this time" is a demoralizing lie.  
Talking about time, I spent hours trying to get signed commits that showed the datetime when I committed. Mission impossible. To keep my private commits (see below) on top and unpushed, I have to run a rebase (one time an auto-rebase would've been useful), my rebase stamps every commit to now. I tried to put the dates back but sign-on-push rewrites the commit at push anyway.  
So I get either one commit in the past, or 10 commits that all happened right now. Suboptimal, I'd say.

# /me abstracts your abstraction

I thought we all agreed git is the best worst option there is, and creating another abstraction over it feels like Too Much for me.  
I quickly saw that my head will burst from trying jujutsu. LLMs of course have very outdated info about it, as it isn't even at 1.0 yet and things are changing all the time. The issue is that even LLMs are struggling with jj, even after slowly creating the so-called "skill" for them with everything required to work with it.  
I had to create an abstraction for the abstraction for the abstraction with custom aliases for working with private commits - the only auto-rebase I want, to keep private commits (`git.private-commits` setting) on top and not be pushed, isn't an option by default, and push refuses to push the private commits. I had to do some manual dance all the time as I _need_ these local repo changes in existing files. Using private commits is encouraged instead of keeping things in the uncommitted files, so this is a head-scratcher.

# jujutsu is still powerful

The `undo` and operation log are _so good_. Sure, git reflog is nice, but even when I was breaking things, I could easily find the command and undo the damage. `evolog`, `run`, `absorb` and so many other commands are great.

# I'm hitting undo on jj

Low working memory can't hold a state that mutates without me acting, and rewards me with stale timestamps. That's a no-go for ADHD, as I need a world that stays put, with visible proof of work. That's exactly what jj removes.  
I consider this attempt at using jujutsu[^jj] as unsuccessful. But maybe you will enjoy it more?


[^forgor]: Have I mentioned my ADHD brain is so forgetful? I was happy to find this option, but it's not useful as-is now.
[^same]: Same but different but same, actually.
[^jj]: Is it called jujutsu because it's kicking my ADHD butt?
