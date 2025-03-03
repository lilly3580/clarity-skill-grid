# SkillGrid
A decentralized app for tracking and visualizing skill growth on the Stacks blockchain.

## Features
- Create and manage skill profiles
- Track skill levels and progress
- Visual skill grid representation
- Growth metrics and improvement tracking

## Setup and Installation
1. Clone the repository
2. Install Clarinet: `curl -L https://get.clarinet.sh | sh`
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to execute test suite

## Usage Examples
```clarity
;; Create a new skill profile
(contract-call? .skill-grid create-profile "Developer Profile")

;; Add a skill
(contract-call? .skill-grid add-skill "Smart Contracts" u1)

;; Update skill level
(contract-call? .skill-grid update-skill-level "Smart Contracts" u2)

;; Get skill profile
(contract-call? .skill-grid get-profile tx-sender)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
