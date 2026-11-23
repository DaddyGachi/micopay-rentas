# RT-V5 · Guest and host perspective

- **Issue:** #5
- **Country / general region:** United States
- **Did you run the demo locally?** no

## 1. First read — what do you think it is?

*Read the README only up to its first `##` heading. Write this before reading anything else.*

- What does MicoPay Rentas do, in your own words?
  > It's a short-term rental platform for Tepoztlán, Morelos that uses a Stellar escrow contract to hold booking payments instead of keeping them in a platform bank account. The host only gets paid after the guest checks in. Cancellation policies and damage deposits are encoded in the smart contract, and the platform takes a 3% fee.

- Who is it for?
  > Guests looking to rent short-term accommodations in Tepoztlán, Morelos, and hosts who have properties to rent there.

- What problem does it solve?
  > It solves the trust problem around who holds the booking funds before a stay is completed. Instead of the platform holding the money, it sits in a blockchain escrow that automatically enforces cancellation policies and damage deposits, with the platform acting as a neutral arbiter for disputes.

## 2. After the full README — what did you get wrong?

- What did you misunderstand in step 1, or what surprised you?
  > I understood it's for Tepoztlán specifically, but I didn't realize this is a testnet demo with fictional listings - I assumed it was a live product. I also didn't understand that the escrow contract has specific functions (lock, cancel, release, dispute, claim_damage, resolve, settle_default, bump) and that the booking ID is a SHA-256 hash. The "demo clock" scaling of time surprised me - that you can compress days into minutes for testing. I also didn't expect the connection to the broader MicoPay ecosystem with cash-in through agents and SPEI payouts.

- What is still unclear?
  > The relationship between the current demo (local testnet keys) and the planned MicoPay app integration is clear in concept, but I don't understand how the sign-request flow works in the MicoPay app - the README mentions `/sign-requests` as the same path as MicoPay Café, but I haven't seen that product.

## 3. Short-term rentals where you live

- Your country / general region (no city or address needed).
  > United States

- Where you live, how do people rent homes for short stays? (Airbnb, Booking, other platforms, social media groups, renting directly…)
  > Mostly Airbnb and Vrbo for vacation rentals. Some people use Booking.com for hotels but rarely for homes. Social media groups (Facebook, local community groups) sometimes have rental listings, but less common. Direct rental between host and guest happens but is rare - people usually want platform protection.

- What fees do guests or hosts notice, and what do they think of them? A percentage is fine; no amounts of money.
  > Guests notice Airbnb's service fee (often around 14% but varies by listing) and cleaning fees. Hosts notice Airbnb's host fee (around 3% for most hosts). People generally accept these fees as the cost of using the platform, but guests sometimes complain about high cleaning fees that feel disproportionate to the actual cleaning cost.

- Do people book directly with the host? What makes them trust or distrust doing that?
  > Direct booking is uncommon except among people who already know each other or for long-term rentals. Distrust comes from: no platform recourse if the property doesn't match the listing, no review system, security concerns about payment methods, and no clear cancellation enforcement. Trust comes from personal references, previous successful direct dealings, or when the host is well-known in the community.

- Are there common problems with cancellations, damage deposits or disputes?
  > Cancellations are a frequent point of friction - guests sometimes feel hosts cancel on them for higher-paying bookings, and hosts worry about last-minute cancellations that leave the property empty. Damage deposits are controversial; guests often don't understand when they might be charged, and hosts find it difficult to actually claim damages without photographic evidence and clear documentation. Disputes over property condition vs. listing accuracy are common.

- Do you live this yourself (as a guest or host), or only hear about it?
  > I only hear about it through friends and online discussions, not personal experience.

## 4. Value

- **How useful does it look to you?** 1 (not at all) – 5 (very). Why?
  > 3. The escrow-based approach is conceptually strong for solving trust problems, especially the automatic enforcement of cancellation policies and the constraint that the arbiter can only split funds between the three parties (guest, host, platform). However, it's geographically limited to Tepoztlán, and as a testnet demo, it's not clear how this would scale to other locations or how the user experience would compare to established platforms like Airbnb.

- What is the most valuable part?
  > The escrow contract's design where the arbiter (MicoPay) can only split funds between guest, host, and platform, and cannot send funds anywhere else. This constraint, mentioned in the README's "Custody" section and in the dispute resolution step, creates real trust because the platform cannot unilaterally take the money.

- What is missing?
  > I don't see mention of a review system or reputation mechanism for guests and hosts. The README focuses on the financial escrow but doesn't address how people build trust in each other's reliability. Also missing: how the listing verification works (how do guests know the property exists and matches the description?), and what happens if the property is fundamentally different from what was booked.

- What would stop you (or the person in your issue's role) from using it?
  > As a guest: lack of reviews/reputation system for hosts and properties, uncertainty about whether the fictional listings in the demo would be replaced with verified real properties, and the requirement to use Stellar/USDC might be a barrier for people unfamiliar with crypto. As a host: the complexity of the system might be daunting compared to just listing on Airbnb, and the 3% fee is competitive but the user experience needs to be simple enough to be worth switching.

## 5. The MicoPay app

*The README section "How it connects to the MicoPay app (planned)" describes the guest paying from the MicoPay app and the host cashing out with an agent or via SPEI.*

- Does that connection make the product more useful to you? What would it change for you?
  > Yes, significantly. The planned connection makes it much more practical because guests can pay with cash through the MicoPay cash network (removing the crypto barrier), and hosts can cash out through agents or SPEI (direct to bank). This bridges the gap between blockchain-based escrow and everyday fiat usage. The single identity across MicoPay products (Stellar address) is also valuable for reducing friction. Without this connection, the product would only work for crypto-savvy users; with it, it could work for anyone.

## 6. What confused you

- Which screen, step or term confused you, and what did you expect instead?
  > The term "DEMO_DAY_SECS" and the concept of scaling time (one calendar day lasting 60 seconds by default) was confusing at first. I expected a real-time demo or explained simulation, not time compression. The README explains it well on second read, but initially it seemed like a technical detail that might affect how the escrow timing works. Also, the mention of `/sign-requests` as "the same path as MicoPay Café" assumes familiarity with that other product, which I don't have.

## 7. Questions for your issue

*Copy the questions from your issue here and answer them.*

- Would you trust MicoPay to decide a dispute between guest and host? Why?
  > Yes, I would trust MicoPay as an arbiter more than I would trust a traditional platform's customer support. The reason is the technical constraint mentioned in the README's "Custody" section and step 4 of "How a booking works": MicoPay can only split the escrow between guest, host, and platform, and cannot send funds anywhere else. The platform can never take more than its 3% fee. This constraint is enforced by the smart contract, not by policy. Traditional platforms have full control over the funds and could theoretically make arbitrary decisions; here, the arbiter's power is structurally limited.

- The README says the arbiter can only split the escrow between guest, host and platform. Does that limit make you trust it more?
  > Yes, absolutely. This is the most trust-building feature. Knowing that the arbiter cannot send funds anywhere else, and that the platform is capped at its 3% fee, means there's no scenario where MicoPay could walk away with the booking money. The worst-case outcome is a dispute decision I disagree with, but not theft. This is mentioned in the "Custody" section and reinforced in step 4 of the booking flow.

- What would you need to see to trust the dispute process?
  > I would need to see: (1) clear documentation of what evidence is required for disputes (photos, messages, check-in/check-out timestamps), (2) examples of past dispute decisions (anonymized) to understand how MicoPay applies its judgment, (3) a timeline for how quickly disputes are resolved (the README mentions 7 days but that's for settlement if the arbiter doesn't decide - what's the SLA for actually deciding?), and (4) transparency about whether the arbiter decision can be appealed or is final. The README's "Custody" section establishes the technical trust, but procedural trust needs more detail.

## 8. Ideas

Up to 3. For each one: the problem it solves, then the idea.

1. **Problem:** Guests have no way to know if a property actually exists and matches the listing before paying into escrow. **Idea:** Add a verification badge system where MicoPay (or a trusted local agent) physically verifies properties and certifies that photos and amenities are accurate. The verification status could be displayed on each listing.

2. **Problem:** The 7-day arbiter window for dispute resolution means funds are locked for at least that long if a dispute is filed, which could be frustrating for guests who need their money back quickly for legitimate issues. **Idea:** Offer an optional "fast-track" dispute resolution where the guest can pay a small additional fee (e.g., 1% of the booking) to get a decision within 24 hours, with the fee going to MicoPay only if the guest's claim is rejected (to discourage frivolous fast-track requests).

3. **Problem:** There's no mention of a review or reputation system, which is crucial for building trust between strangers. **Idea:** After a booking completes (either through release or settlement), prompt both guest and host to leave reviews. Reviews are only published after both parties have submitted, or after a timeout, to prevent retaliatory reviews. Display aggregate ratings on listings and user profiles.
