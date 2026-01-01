# Bonus Features - Documentation

## Overview
Bonus features provide extra points for implementing advanced capabilities. Each bonus feature connects to specific phases where it's most relevant.

## Bonus Points Allocation

| Bonus Feature | Points | Relevant Phases | Implementation Priority |
|--------------|---------|-----------------|----------------------|
| Reusable Intelligence (Subagents, Agent Skills) | +200 | **ALL Phases** | High |
| Cloud-Native Blueprints | +200 | **Phase IV, V** | Medium |
| Multi-language Support/Urdu | +100 | **Phase III** | Medium |
| Voice Commands | +200 | **Phase III** | Medium |

**TOTAL BONUS POSSIBLE**: +600 points

---

## Bonus 1: Reusable Intelligence (+200 points)

### Description
Create Claude Code Agent Skills and Subagents for automating repetitive development tasks across all phases.

### Implementation Strategy

#### Agent Skills to Create

##### 1. Spec Generation Skill
**Purpose**: Automatically generate spec.md from natural language requirements

**Location**: `.claude/commands/specify-skill.md`

**Usage**:
```
User: "I need a user authentication feature with JWT"
Skill: Generates complete spec.md with:
- User stories
- Functional requirements
- Data models
- API endpoints
- Acceptance criteria
```

**Implementation**:
- Prompt template for requirements
- Structured output format
- Links to constitution
- Includes acceptance criteria

##### 2. Task Breakdown Skill
**Purpose**: Break down features into atomic tasks.md

**Location**: `.claude/commands/tasks-skill.md`

**Usage**:
```
User: "Break down user authentication"
Skill: Generates tasks.md with:
- 15-20 specific tasks
- Dependencies mapped
- Time estimates
- Progress tracking
```

**Implementation**:
- Analyze feature scope
- Generate sequential tasks
- Identify dependencies
- Assign priorities

##### 3. API Generation Skill
**Purpose**: Generate FastAPI/Next.js code from spec

**Location**: `.claude/commands/api-gen-skill.md`

**Usage**:
```
User: "Generate CRUD endpoints for tasks"
Skill: Creates:
- FastAPI routes
- Pydantic schemas
- Error handling
- Validation logic
```

**Implementation**:
- Read API spec from docs/spec.md
- Generate endpoint code
- Apply constitution rules
- Include type hints

##### 4. MCP Tool Generation Skill
**Purpose**: Generate MCP tool code from specification

**Location**: `.claude/commands/mcp-gen-skill.md`

**Usage**:
```
User: "Create MCP tool for task deletion"
Skill: Generates:
- Tool definition
- Input validation
- Error handling
- Database integration
```

**Implementation**:
- Tool spec to code
- MCP SDK integration
- Stateless design
- Return proper JSON

##### 5. Deployment Automation Skill
**Purpose**: Automate Kubernetes/Docker deployment

**Location**: `.claude/commands/deploy-skill.md`

**Usage**:
```
User: "Deploy to Minikube"
Skill: Generates:
- Dockerfile
- Kubernetes manifests
- Helm charts
- Deployment scripts
```

**Implementation**:
- Analyze project structure
- Generate Docker images
- Create K8s resources
- Configure Helm values

### Subagents to Create

##### 1. Architecture Review Subagent
**Purpose**: Review code against architectural decisions

**Trigger**: After major changes

**Responsibilities**:
- Check architecture alignment
- Verify design patterns
- Suggest improvements
- Document deviations

##### 2. Testing Subagent
**Purpose**: Generate and run tests

**Trigger**: Before deployment

**Responsibilities**:
- Generate unit tests
- Generate integration tests
- Run test suites
- Report coverage

##### 3. Documentation Subagent
**Purpose**: Auto-generate documentation

**Trigger**: After feature completion

**Responsibilities**:
- Generate API docs
- Generate README updates
- Create code comments
- Update architecture docs

### Implementation across Phases

**Phase I**: Use spec generation, API generation skills
**Phase II**: Use all skills (auth endpoints, database models)
**Phase III**: Use MCP tool generation, deployment skills
**Phase IV**: Use deployment automation, Kubernetes generation
**Phase V**: Use all skills for cloud-native deployment

### Acceptance Criteria

- [ ] At least 5 Agent Skills created
- [ ] At least 3 Subagents created
- [ ] Skills work in Claude Code CLI
- [ ] Skills generate correct output
- [ ] Documentation for each skill
- [ ] Used skills in at least 3 phases

### Files to Create

- `.claude/commands/specify-skill.md`
- `.claude/commands/tasks-skill.md`
- `.claude/commands/api-gen-skill.md`
- `.claude/commands/mcp-gen-skill.md`
- `.claude/commands/deploy-skill.md`
- `.claude/subagents/architecture-review.md`
- `.claude/subagents/testing.md`
- `.claude/subagents/documentation.md`

---

## Bonus 2: Cloud-Native Blueprints (+200 points)

### Description
Create spec-driven deployment blueprints using Claude Code Agent Skills for Kubernetes and cloud deployment.

### Relevant Phases
- **Phase IV**: Minikube local deployment
- **Phase V**: Cloud deployment (AKS/GKE/OKE)

### Implementation Strategy

#### Blueprint 1: Containerization Blueprint

**Purpose**: Automatically generate Docker images for any app

**Input**: Application spec (tech stack, dependencies)
**Output**: Dockerfile, docker-compose.yml

**Blueprint Content**:
```
Input:
  - Frontend: Next.js, TypeScript, Tailwind
  - Backend: FastAPI, Python, SQLModel

Output:
  - Dockerfile (multi-stage)
  - docker-compose.yml
  - .dockerignore
  - Build scripts
```

#### Blueprint 2: Kubernetes Deployment Blueprint

**Purpose**: Generate complete Kubernetes manifests

**Input**: Application components, resource requirements
**Output**: Deployment, Service, ConfigMap, Secret

**Blueprint Content**:
```
Input:
  - App: TodoApp
  - Components: frontend, backend
  - Replicas: 3
  - Resources: CPU 500m, RAM 512Mi

Output:
  - deployment.yaml
  - service.yaml
  - configmap.yaml
  - secret.yaml
  - ingress.yaml
```

#### Blueprint 3: Helm Chart Blueprint

**Purpose**: Generate Helm chart for production deployment

**Input**: Application spec, configuration values
**Output**: Helm chart with templates and values

**Blueprint Content**:
```
Input:
  - App: TodoApp
  - Version: 1.0.0
  - Config: env vars, secrets, resources

Output:
  - Chart.yaml
  - values.yaml
  - values-dev.yaml
  - values-prod.yaml
  - templates/deployment.yaml
  - templates/service.yaml
  - templates/ingress.yaml
```

#### Blueprint 4: CI/CD Pipeline Blueprint

**Purpose**: Generate GitHub Actions workflow for deployment

**Input**: Registry, cluster, app details
**Output**: GitHub Actions workflow

**Blueprint Content**:
```
Input:
  - Registry: Docker Hub
  - Cluster: Minikube/GKE
  - App: TodoApp

Output:
  - .github/workflows/deploy.yml
  - Build step
  - Test step
  - Deploy step
```

#### Blueprint 5: Dapr Integration Blueprint

**Purpose**: Generate Dapr components for cloud-native app

**Input**: Dapr features needed (Pub/Sub, State, etc.)
**Output**: Dapr component YAMLs

**Blueprint Content**:
```
Input:
  - Features: pubsub (Kafka), state (PostgreSQL)

Output:
  - dapr/components/pubsub-kafka.yaml
  - dapr/components/state-postgres.yaml
  - Deployment with Dapr sidecar
```

### Implementation

Create Agent Skill: `blueprint-gen-skill.md`

**Usage**:
```
User: "Generate Kubernetes deployment blueprint"
Skill: Creates complete K8s manifests based on app spec
```

**Skill Parameters**:
- Blueprint type (Kubernetes/Helm/CI-CD/Dapr)
- App specifications
- Configuration values

### Acceptance Criteria

- [ ] 5 blueprints created
- [ ] Each blueprint is spec-driven
- [ ] Blueprints are reusable
- [ ] Blueprints include all necessary files
- [ ] Documentation for each blueprint
- [ ] Used in Phase IV and V

### Files to Create

- `blueprints/containerization/`
- `blueprints/kubernetes/`
- `blueprints/helm/`
- `blueprints/cicd/`
- `blueprints/dapr/`
- `.claude/commands/blueprint-gen-skill.md`

---

## Bonus 3: Multi-language Support/Urdu (+100 points)

### Description
Add Urdu language support to Phase III chatbot for bilingual todo management.

### Relevant Phase
- **Phase III**: AI Chatbot

### Implementation Strategy

#### 1. Translation Files

Create `translations/` directory:

```json
// translations/ur.json
{
  "welcome": "آپ کا ٹوڈو ایپ میں خوش آمدید",
  "add_task_prompt": "آپ کیا کرنا چاہتے ہیں؟",
  "task_added": "ٹوڈو شامل کر لیا گیا ہے",
  "task_completed": "ٹوڈو مکمل کر لی گئی ہے",
  "task_deleted": "ٹوڈو حذف کر دی گئی ہے",
  "show_tasks": "آپ کے تمام ٹوڈو دکھائیں",
  "what_pending": "کون سا کیا باقی ہے؟",
  "error": "خرابی پیش آ گئی ہے، دوبارہ کوشش کریں"
}
```

#### 2. Chatbot Prompt Modifications

Update agent prompts to support Urdu:

```python
# Agent instruction
"You are a bilingual todo assistant. You understand and respond in both English and Urdu.
If user speaks in Urdu, respond in Urdu. If user speaks in English, respond in English."

# Example interactions
User (Urdu): "مجھے خریداری کرنی ہے"
Agent: "ٹوڈو 'خریداری' شامل کر لیا گیا ہے" (Calls add_task)

User (English): "Show me my tasks"
Agent: "Here are your tasks:" (Calls list_tasks)
```

#### 3. MCP Tool Responses

Update MCP tools to return Urdu messages when input is Urdu:

```python
def add_task(user_id: str, title: str, description: str = None):
    # Detect language (simple check or use library)
    is_urdu = is_urdu_text(title)

    # Create task
    task = create_task(...)

    # Return response in detected language
    if is_urdu:
        return {
            "message": f"ٹوڈو '{title}' شامل کر لیا گیا ہے",
            "task_id": task.id
        }
    else:
        return {
            "message": f"Task '{title}' has been added",
            "task_id": task.id
        }
```

#### 4. UI Language Toggle

Add language switcher to ChatKit interface:

```typescript
// Language state
const [language, setLanguage] = useState('en');

// Toggle button
<button onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}>
  {language === 'en' ? 'اردو' : 'English'}
</button>

// Use translations
{translations[language].welcome}
```

### Language Detection

Implement simple Urdu detection:

```python
def is_urdu_text(text: str) -> bool:
    # Check for Urdu Unicode range
    urdu_range = (0x0600, 0x06FF)
    for char in text:
        if ord(char) >= urdu_range[0] and ord(char) <= urdu_range[1]:
            return True
    return False
```

### Acceptance Criteria

- [ ] Translation file created for Urdu
- [ ] Agent responds in Urdu when user speaks Urdu
- [ ] MCP tools return Urdu messages appropriately
- [ ] UI language toggle implemented
- [ ] Language detection working
- [ ] All task operations support Urdu

### Files to Create/Modify

- `translations/ur.json`
- `translations/en.json`
- `lib/language-detector.ts`
- `app/chat/page.tsx` (add language toggle)
- Update MCP tools for Urdu support

---

## Bonus 4: Voice Commands (+200 points)

### Description
Add voice input capability to Phase III chatbot using Web Speech API.

### Relevant Phase
- **Phase III**: AI Chatbot

### Implementation Strategy

#### 1. Voice Input Component

Create `components/VoiceInput.tsx`:

```typescript
import { useEffect, useState } from 'react';

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // or 'ur-PK' for Urdu

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      console.error('Speech recognition not supported');
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <button
      onClick={toggleListening}
      className={`voice-button ${isListening ? 'listening' : ''}`}
    >
      🎤 {isListening ? 'Listening...' : 'Tap to speak'}
    </button>
  );
};

export default VoiceInput;
```

#### 2. Integration with Chat Interface

Add voice input to chat page:

```typescript
// app/chat/page.tsx

const [transcript, setTranscript] = useState('');

const handleVoiceTranscript = (text: string) => {
  setTranscript(text);
  // Auto-submit or let user review
  // submitChatMessage(text);
};

return (
  <div className="chat-container">
    {/* Chat messages */}
    <div className="messages">...</div>

    {/* Input area */}
    <div className="input-area">
      <VoiceInput onTranscript={handleVoiceTranscript} />

      <input
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Type or speak your message..."
      />

      <button onClick={() => submitMessage(transcript)}>
        Send
      </button>
    </div>
  </div>
);
```

#### 3. Visual Feedback

Add CSS for listening state:

```css
.voice-button {
  padding: 10px 20px;
  border-radius: 50px;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
}

.voice-button.listening {
  background: #ef4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
```

#### 4. Urdu Voice Support

Configure for Urdu language:

```typescript
// Dynamic language based on selected language
recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

// Note: Urdu speech recognition support varies by browser
// Chrome has better support than Firefox
```

#### 5. Error Handling

Handle speech recognition errors:

```typescript
recognition.onerror = (event) => {
  switch (event.error) {
    case 'no-speech':
      alert('No speech detected. Please try again.');
      break;
    case 'audio-capture':
      alert('Microphone not found. Please check your device.');
      break;
    case 'not-allowed':
      alert('Microphone access denied. Please allow microphone access.');
      break;
    default:
      alert('Error: ' + event.error);
  }
};
```

### Acceptance Criteria

- [ ] Voice input button displays in chat interface
- [ ] Voice input captures speech and converts to text
- [ ] Converted text appears in input field
- [ ] Visual feedback when listening (pulsing button)
- [ ] Error messages for microphone issues
- [ ] Works with both English and Urdu (if supported)
- [ ] Can toggle voice on/off
- [ ] Works in modern browsers (Chrome, Edge)

### Files to Create

- `components/VoiceInput.tsx`
- `styles/voice-input.css`
- Update `app/chat/page.tsx`

### Browser Compatibility

| Browser | Speech Recognition | Urdu Support |
|----------|-------------------|---------------|
| Chrome | ✅ | ⚠️ Limited |
| Edge | ✅ | ⚠️ Limited |
| Firefox | ⚠️ Requires flag | ❌ No |
| Safari | ✅ | ⚠️ Limited |

**Note**: Urdu speech recognition has limited browser support. Implement as best-effort feature.

---

## Implementation Priority

### High Priority (Complete these first)
1. **Reusable Intelligence** - Benefits ALL phases
2. **Cloud-Native Blueprints** - Critical for Phase IV & V

### Medium Priority
3. **Multi-language/Urdu** - Nice to have, relevant to Phase III
4. **Voice Commands** - Advanced feature, relevant to Phase III

## Testing Requirements

### Reusable Intelligence
- Test all skills with Claude Code
- Verify generated output quality
- Test subagent workflows

### Cloud-Native Blueprints
- Test blueprint generation
- Deploy generated manifests
- Verify deployments work

### Multi-language/Urdu
- Test Urdu commands
- Verify agent understands Urdu
- Test language switching
- Test translations

### Voice Commands
- Test voice input in Chrome/Edge
- Test with English commands
- Test with Urdu commands (if supported)
- Test error handling

## Bonus Submission Requirements

For each bonus feature, submit:

1. **Code Implementation**: Complete working code
2. **Documentation**: Explanation of implementation
3. **Demo Video**: Showing feature in action (under 90 seconds)
4. **Usage Guide**: How to use the feature

## Notes

- Implement bonuses in their relevant phases
- Use Claude Code for implementation
- Follow Spec-Driven Development
- Document all bonus implementations
- Test thoroughly before submission
- Consider time constraints - prioritize high-value bonuses

## Success Metrics

- All implemented bonuses work correctly
- Documentation is clear
- Demo videos under 90 seconds
- Code follows constitution
- Bonuses enhance user experience
