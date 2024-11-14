import './index.css';


function dirtyCallback() {
    // get html elements
    const peopleContainer = document.getElementById('people');
    const nInput = document.getElementById('input-n');
    const kInput = document.getElementById('input-k');
    const result = document.getElementById('survivor');

    // reset of children
    peopleContainer.innerHTML = "";

    // getting parameter
    const n = Number(nInput.value);
    const k = Number(kInput.value);

    const answer = calculateJosephusProblem({ n, k });
    console.log({ answer});
    updateHTML(answer, { peopleContainer, result });
}

function calculateJosephusProblem({ n, k }) {
    function createCircle(size, current) {
        return size > 0 ? [current, ...createCircle(size-1, current+1)] : [];
    }

    function sliceArray(arr, start, end) {
        return (start < end) ? [arr[start], ...sliceArray(arr, start + 1, end)] : [];
    }

    function solve(state, k) {
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

function updateHTML({ deadPeopleInOrder, survivor }, { peopleContainer, result }) {
    function createPeopleElements(container, current, n) {
        if (current < n) {
            const newPerson = document.createElement('div');
            newPerson.innerText = `${current+1}`;
            newPerson.className = 'rounded-full size-5 bg-slate-500 transition-colors duration-200 grid place-content-center text-sm';
            container.appendChild(newPerson);
            return [newPerson, ...createPeopleElements(container, current + 1, n)];
        } else {
            return [];
        }
    }

    function applyAnimations(elements, deadInOrder, current) {
        if (current >= deadInOrder.length) return;
        const delay = 200;
        const personIndex = deadInOrder[current];
        const personElement = elements[personIndex];
        personElement.classList.add('animate-color-change');
        personElement.style.animationDelay = `${current*delay}ms`;
        applyAnimations(elements, deadInOrder, current + 1);
    }

    const people = createPeopleElements(peopleContainer, 0, deadPeopleInOrder.length+1);
    applyAnimations(people, deadPeopleInOrder, 0);
    result.textContent = `The Survivor is #${survivor+1}`;
}

// register to the run-button
const runButton = document.getElementById("run");
runButton.addEventListener("click", dirtyCallback)

// and run once at the start
dirtyCallback();
