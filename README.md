# 💕 Wumpus World Marriage Proposal Game

A romantic twist on the classic Wumpus World puzzle game! When your girlfriend finds the gold, a beautiful marriage proposal surprise will appear on screen. This is a unique and nerdy way to pop the question! 💍

## 🎯 Game Purpose

This game transforms the classic AI Wumpus World problem into a romantic adventure. The ultimate goal is to create a memorable and interactive marriage proposal experience by combining logic, adventure, and love.

## 🎮 How to Play

### Game Objective
Navigate through a 4x4 grid world to find the **gold** while avoiding deadly hazards. When the gold is discovered, a special marriage proposal surprise will be revealed!

### Game Rules

#### World Layout
- **4x4 Grid** - 16 rooms total, arranged in a square grid
- **Starting Position** - You begin at [1,1] (bottom-left corner)
- **Safe Exit** - Return to [1,1] after finding the gold to win completely

#### Hazards & Objectives
1. **The Wumpus** 👹 
   - A deadly monster located in one room
   - Entering the Wumpus room = **Game Over**
   - There is exactly **one Wumpus** in the world

2. **Pits** 🕳️ 
   - Deep bottomless holes scattered throughout the world
   - Falling into any pit = **Game Over**
   - Multiple pits may exist (typically 2-3 pits)

3. **The Gold** 🏆 
   - Your ultimate target hidden in one room
   - Finding the gold triggers the **proposal surprise**
   - There is exactly **one gold** in the world

#### Environmental Clues (Percepts)
Your character can sense danger and treasure from adjacent rooms:

- **Breeze** 💨 
  - Felt when **at least one pit** is in an adjacent room
  - Adjacent means: **North, South, East, or West** (no diagonals)
  - If you feel a breeze, **at least one** of the 4 neighboring rooms contains a pit

- **Stench** 🦨 
  - Detected when the **Wumpus** is in an adjacent room
  - Adjacent means: **North, South, East, or West** (no diagonals)
  - If you smell a stench, the Wumpus is **exactly one room away**

- **Glitter** ✨ 
  - Seen when the **gold** is in the current room
  - This means you've found it - **proposal time!**

#### Movement Rules
- **One Step at a Time** - Move only to adjacent rooms (North/South/East/West)
- **No Diagonal Movement** - You cannot move diagonally
- **Boundary Walls** - Cannot move outside the 4x4 grid
- **Click to Move** - Use mouse clicks on directional arrows

#### Logical Deduction Examples

**Example 1: Safe Navigation**
```
You're in room [2,2] and feel a BREEZE
→ At least one of [2,3], [2,1], [1,2], [3,2] contains a pit
→ Avoid these rooms until you gather more information
```

**Example 2: Wumpus Location**
```
You feel STENCH in [1,2] and [2,1] but NOT in [1,1]
→ The Wumpus must be in [2,2] (the only room adjacent to both)
→ Never enter [2,2]!
```

**Example 3: Safe Room Confirmation**
```
You're in [3,3] with NO breeze, stench, or glitter
→ All adjacent rooms [3,4], [3,2], [2,3], [4,3] are safe
→ No pits, no Wumpus in any neighboring room
```

#### Winning Conditions
1. **Find the Gold** - Enter the room containing the gold
2. **Survive the Journey** - Avoid all pits and the Wumpus
3. **Enjoy the Surprise** - Watch the romantic proposal unfold!

### Controls
- **Mouse Click** - Click on directional arrows to move your character
- **Strategic Movement** - Plan your path carefully using the environmental hints

### Game Flow
1. Start at position [1,1] (bottom-left corner)
2. Click arrow buttons to move step by step
3. Pay attention to environmental clues
4. Avoid hazards and find the safe path to the gold
5. **Surprise!** 💝 When you find the gold, the proposal appears!

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/0x4ab99BA/wumpus-world-proposal.git
   cd wumpus-world-proposal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173/`
   - The game should load automatically

### Build for Production

To create a production build for deployment:

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any web hosting service.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Phaser.js** - 2D game engine for smooth animations and interactions
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Fast build tool and development server
- **HTML5 Canvas** - Hardware-accelerated game rendering

## 📁 Project Structure

```
wumpus-world-proposal/
├── src/
│   ├── main.ts              # Game entry point
│   ├── scenes/              # Game scenes
│   │   ├── GameScene.ts     # Main game logic
│   │   └── ProposalScene.ts # Marriage proposal scene
│   ├── objects/             # Game entities
│   ├── assets/              # Game resources
│   │   ├── images/          # Sprites and graphics
│   │   └── audio/           # Sound effects and music
│   └── utils/               # Helper functions
├── index.html               # Main HTML file
├── package.json             # Project configuration
└── README.md               # This file
```

## 🎯 Game Strategy Tips

### Basic Strategy
1. **Start Slow** - From [1,1], move carefully to adjacent rooms
2. **Gather Information** - Note all percepts (breeze, stench) before moving
3. **Map Your Knowledge** - Keep track of what you know about each room
4. **Use Logical Deduction** - Combine clues to determine safe paths

### Advanced Tactics
1. **Triangulation** - Use multiple observation points to pinpoint hazard locations
   ```
   Example: Feel stench at [1,2] and [2,1] → Wumpus is at [2,2]
   ```

2. **Process of Elimination** - Rule out dangerous rooms systematically
   ```
   Example: No breeze at [1,1], [1,2], [2,1] → [2,2] is safe from pits
   ```

3. **Safe Path Planning** - Always have an escape route back to [1,1]

4. **Risk Assessment** - Sometimes you need to make educated guesses
   - If you feel breeze at [2,2] only, and know [3,2] is safe
   - Then the pit is likely in [2,3], [1,2], or [2,1]

### Common Mistakes to Avoid
- **Rushing** - Moving without analyzing percepts
- **Forgetting Previous Info** - Not remembering what you learned
- **Ignoring Boundaries** - Remember the world is only 4x4
- **Diagonal Thinking** - Hazards are only in orthogonal directions

### Winning Mindset
- **Patience is Key** - The proposal surprise is worth careful navigation
- **Think Like a Detective** - Use clues to solve the mystery
- **Stay Calm** - One wrong move ends the game, but logical thinking keeps you safe

## 🎨 Features

- **Smooth Animations** - Character movement, trap effects, and victory animations
- **Interactive UI** - Mouse-controlled movement with visual feedback
- **Responsive Design** - Works on desktop and mobile devices
- **Romantic Theme** - Custom graphics and romantic color scheme
- **Surprise Element** - Hidden proposal reveal upon winning

## 💝 The Proposal Surprise

When the gold is found, the game transitions to a beautiful proposal scene featuring:
- Romantic animations and effects
- Personalized proposal message
- Beautiful visuals designed to create a magical moment
- *"Will you marry me?"* 💍

## 🤝 Contributing

This is an open-source project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Acknowledgments

- Inspired by the classic "Hunt the Wumpus" game by Gregory Yob (1973)
- Built with love for creating unforgettable proposal moments
- Thanks to the Phaser.js community for excellent documentation and examples

---

**Made with ❤️ for unforgettable proposals**

*May your code compile and your love be true! 💕*