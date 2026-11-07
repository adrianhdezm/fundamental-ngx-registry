import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Input, Textarea, type FormState } from './input';

/** Plain label until the form component is ported (form label with colon, required and inline help). */
function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: ReactNode }) {
    return (
        <label
            htmlFor={htmlFor}
            className="font-sap-font-family text-sap-font-size leading-[normal] text-sap-content-label-color"
        >
            {children}
            {required && (
                <span aria-hidden="true" className="ms-0.5 text-sap-field-required-color">
                    *
                </span>
            )}
        </label>
    );
}

const COLUMN = 'flex flex-col gap-2';
const ITEM = 'flex flex-col';
const STATES: FormState[] = ['default', 'success', 'information', 'warning', 'error'];
/** fundamental-styles' placeholders, so the fields compare by pixels. */
const STATE_PLACEHOLDER: Record<FormState, string> = {
    default: 'e.g., Jane Doe',
    success: 'e.g., +1 555 123 4567',
    information: 'e.g., Optional comments',
    warning: "e.g., Your first pet's name",
    error: 'Invalid username'
};

const meta = {
    title: 'Components/Input',
    component: Input,
    parameters: {
        docs: {
            description: {
                component:
                    'Text fields for a single line (`Input`) or several lines (`Textarea`), on Base UI’s Input. ' +
                    'Pair every field with a label, and use value states with a form message that explains them. ' +
                    'Compact density is `data-density="compact"` on the field or an ancestor.'
            }
        }
    },
    argTypes: {
        state: { control: 'select', options: ['default', 'success', 'error', 'warning', 'information'] }
    },
    args: {
        state: 'default',
        placeholder: 'Field placeholder text',
        disabled: false,
        readOnly: false,
        noNumberSpinner: false,
        'aria-label': 'Playground'
    }
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => (
        <div className="max-w-sm">
            <Input {...args} />
        </div>
    )
};

export const Examples: Story = {
    render: () => (
        <div className={COLUMN}>
            <div className={ITEM}>
                <Label htmlFor="input-default">Default Input:</Label>
                <Input id="input-default" placeholder="e.g., Jane Doe" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="input-required" required>
                    Required Input:
                </Label>
                <Input id="input-required" type="email" placeholder="e.g., user@example.com" required />
            </div>
            <div className={ITEM}>
                <Label htmlFor="input-password">Password</Label>
                <Input id="input-password" type="password" placeholder="Field placeholder text" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="input-compact">Compact</Label>
                <Input id="input-compact" data-density="compact" placeholder="Compact" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="input-number">Number without spinner</Label>
                <Input id="input-number" type="number" noNumberSpinner defaultValue={42} />
            </div>
        </div>
    )
};

export const States: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Read-only fields show a dotted line; disabled fields are dimmed and not focusable. Only the error state sets `aria-invalid`.'
            }
        }
    },
    render: () => (
        <div className={COLUMN}>
            {STATES.map((state) => (
                <div key={state} className={ITEM}>
                    <Label htmlFor={`state-${state}`}>{state}</Label>
                    <Input id={`state-${state}`} state={state} placeholder={STATE_PLACEHOLDER[state]} />
                </div>
            ))}
            <div className={ITEM}>
                <Label htmlFor="state-readonly">Read-only</Label>
                <Input id="state-readonly" readOnly defaultValue="Canada" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="state-disabled">Disabled</Label>
                <Input id="state-disabled" disabled defaultValue="SAP" />
            </div>
        </div>
    )
};

export const Controlled: Story = {
    name: 'Controlled',
    parameters: {
        docs: {
            description: {
                story: '`value` with `onValueChange`, the React form of Angular’s reactive forms example.'
            }
        }
    },
    render: function Render() {
        const [form, setForm] = useState({ inputControl: 'Default value', disabledInputControl: 'Disabled value' });
        return (
            <div className="flex max-w-md flex-col gap-2">
                <div className={ITEM}>
                    <Label htmlFor="form-input-1">Default Input:</Label>
                    <Input
                        id="form-input-1"
                        placeholder="Field placeholder text"
                        value={form.inputControl}
                        onValueChange={(inputControl) => setForm({ ...form, inputControl })}
                    />
                </div>
                <div className={ITEM}>
                    <Label htmlFor="form-input-2">Disabled Input:</Label>
                    <Input id="form-input-2" disabled value={form.disabledInputControl} />
                </div>
                <pre className="text-sap-font-small-size text-sap-text-color">{JSON.stringify(form, null, 2)}</pre>
            </div>
        );
    }
};

export const TextareaExamples: Story = {
    name: 'Textarea',
    render: () => (
        <div className={COLUMN}>
            <div className={ITEM}>
                <Label htmlFor="textarea-default">Default textarea:</Label>
                <Textarea id="textarea-default" placeholder="Field placeholder text" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-required" required>
                    Required textarea:
                </Label>
                <Textarea id="textarea-required" rows={4} placeholder="Write something here" required />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-compact" required>
                    Compact and Required textarea:
                </Label>
                <Textarea
                    id="textarea-compact"
                    data-density="compact"
                    placeholder="Field placeholder text"
                    defaultValue="Compact textarea"
                    required
                />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-readonly-text">Read-only textarea</Label>
                <Textarea id="textarea-readonly-text" readOnly defaultValue="Read-only text that cannot be changed." />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-project">Project Description:</Label>
                <Textarea id="textarea-project" state="error" placeholder="Describe the project" />
            </div>
        </div>
    )
};

export const TextareaStates: Story = {
    name: 'Textarea states',
    parameters: {
        docs: {
            description: {
                story: 'Textareas in every value state, plus disabled and read-only textareas.'
            }
        }
    },
    render: () => (
        <div className={COLUMN}>
            {(['success', 'error', 'warning', 'information'] as const).map((state) => (
                <div key={state} className={ITEM}>
                    <Label htmlFor={`textarea-${state}`}>{`${state[0].toUpperCase()}${state.slice(1)} message:`}</Label>
                    <Textarea id={`textarea-${state}`} state={state} rows={2} placeholder="Enter your message here" />
                </div>
            ))}
            <div className={ITEM}>
                <Label htmlFor="textarea-disabled">Message (Disabled)</Label>
                <Textarea id="textarea-disabled" rows={2} disabled defaultValue="Disabled textarea" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-readonly">Message (Read-Only)</Label>
                <Textarea id="textarea-readonly" rows={2} readOnly defaultValue="Read Only textarea" />
            </div>
        </div>
    )
};

export const TextareaCounter: Story = {
    name: 'Textarea counter',
    parameters: {
        docs: {
            description: {
                story: '`maxLength` limits the length and shows the characters left below the textarea; the counter describes it (`aria-describedby`).'
            }
        }
    },
    render: () => (
        <div className={COLUMN}>
            <div className={ITEM}>
                <Label htmlFor="textarea-counter">Message</Label>
                <Textarea id="textarea-counter" rows={4} maxLength={200} placeholder="Write something here" />
            </div>
            <div className={ITEM}>
                <Label htmlFor="textarea-max-length">Max length</Label>
                <Textarea id="textarea-max-length" maxLength={150} defaultValue="Max Length" />
            </div>
        </div>
    )
};

export const TextareaControlled: Story = {
    name: 'Textarea controlled',
    render: function Render() {
        const [value, setValue] = useState('');
        const [touched, setTouched] = useState(false);
        return (
            <div className="flex max-w-md flex-col gap-2">
                <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                    <div className={ITEM}>
                        <Label htmlFor="textarea-21">Textarea:</Label>
                        <Textarea
                            id="textarea-21"
                            placeholder="Field placeholder text"
                            value={value}
                            onValueChange={setValue}
                            onBlur={() => setTouched(true)}
                        />
                    </div>
                    <div className={ITEM}>
                        <Label htmlFor="textarea-22">Disabled Textarea:</Label>
                        <Textarea
                            id="textarea-22"
                            disabled
                            value="Disabled value"
                            placeholder="Field placeholder text"
                        />
                    </div>
                </fieldset>
                <pre className="text-sap-font-small-size text-sap-text-color">
                    {`Value: ${JSON.stringify({ textAreaControl: value, disabledTextAreaControl: 'Disabled value' })}\nTouched: ${touched}  Dirty: ${value !== ''}`}
                </pre>
            </div>
        );
    }
};

export const TextareaPlayground: Story = {
    name: 'Textarea playground',
    args: { 'aria-label': 'Textarea playground' },
    argTypes: { noNumberSpinner: { table: { disable: true } } },
    render: ({ state, placeholder, disabled, readOnly, 'aria-label': ariaLabel }) => (
        <div className="max-w-sm">
            <Textarea
                state={state}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                aria-label={ariaLabel}
                defaultValue="Default"
            />
        </div>
    )
};
