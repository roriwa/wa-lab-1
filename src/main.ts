import './index.css';


function dirtyCallback() {
    // get html elements
    const peopleContainer: HTMLDivElement = document.getElementById('people') as HTMLDivElement;
    const nInput: HTMLInputElement = document.getElementById('input-n') as HTMLInputElement;
    const kInput: HTMLInputElement = document.getElementById('input-k') as HTMLInputElement;
    const result: HTMLDivElement = document.getElementById('survivor') as HTMLDivElement;

    // reset of children
    peopleContainer.innerHTML = "";

    // getting parameter
    const n = Number(nInput.value);
    const k = Number(kInput.value);

    const answer = calculateJosephusProblem({ n, k });
    console.log({ answer});
    updateHTML(answer, { peopleContainer, result });
}

interface Config {
    n: number
    k: number
}

interface Answer {
    deadPeopleInOrder: number[]
    survivor: number
}

interface State {
    deadOrder: number[]
    circle: number[]
    index: number
}

function calculateJosephusProblem({ n, k }: Config): Answer {
    function createCircle(size: number, current: number): number[] {
        return size > 0 ? [current, ...createCircle(size-1, current+1)] : [];
    }

    function sliceArray(arr: number[], start: number, end: number): number[] {
        return (start < end) ? [arr[start], ...sliceArray(arr, start + 1, end)] : [];
    }

    function solve(state: State, k: number): State {
        if (state.circle.length > 1) {
            const index = (state.index + k - 1) % state.circle.length;
            return solve({
                circle: [...sliceArray(state.circle, 0, index), ...sliceArray(state.circle, index+1, state.circle.length)],
                deadOrder: [...state.deadOrder, state.circle[index]],
                index: index,
            }, k);
        } else {
            return state;
        }
    }

    const result = solve({
        circle: createCircle(n, 0),
        deadOrder: [],
        index: 0,
    }, k);

    return {
        survivor: result.circle[0],
        deadPeopleInOrder: result.deadOrder,
    };
}

function updateHTML({ deadPeopleInOrder, survivor }: Answer, { peopleContainer, result }: { peopleContainer: HTMLDivElement, result: HTMLDivElement }) {
    function createPeopleElements(container: HTMLDivElement, n: number): HTMLDivElement[] {
        if (n > 0) {
            const newPerson = document.createElement('div');
            newPerson.className = 'rounded-full size-5 bg-slate-500 transition-colors duration-200';
            container.appendChild(newPerson);
            return [newPerson, ...createPeopleElements(container, n-1)];
        } else {
            return [];
        }
    }

    function applyAnimations(elements: HTMLDivElement[], deadInOrder: number[], current: number): void {
        if (current >= deadInOrder.length) return;
        const delay: number = 200;
        const personIndex = deadInOrder[current];
        const personElement = elements[personIndex];
        personElement.classList.add('animate-color-change');
        personElement.style.animationDelay = `${current*delay}ms`;
        applyAnimations(elements, deadInOrder, current + 1);
    }

    const people = createPeopleElements(peopleContainer, deadPeopleInOrder.length + 1);
    applyAnimations(people, deadPeopleInOrder, 0);
    result.textContent = `The Survivor is #${survivor+1}`;
}

// register to the run-button
const runButton = document.getElementById("run")!;
runButton.addEventListener("click", dirtyCallback)

// and run once at the start
dirtyCallback();
