import './index.css';

const runButton = document.getElementById("run")!;

function josephusProblem(){
    const peopleContainer: HTMLDivElement = document.getElementById('people') as HTMLDivElement;
    const nInput: HTMLInputElement = document.getElementById('input-n') as HTMLInputElement;
    const kInput: HTMLInputElement = document.getElementById('input-k') as HTMLInputElement;
    const result: HTMLDivElement = document.getElementById('survivor') as HTMLDivElement;

    peopleContainer.innerHTML = "";  // reset of children

    const n = Number(nInput.value);
    const k = Number(kInput.value);

    const delay = 200 as const;

    const deadOrder: number[] = [];
    const circle: number[] = [];
    for (let i = 0; i < n; i++) circle.push(i);

    let index = 0;
    while (circle.length > 1) {
        index = (index + k - 1) % circle.length;
        deadOrder.push(circle[index]);
        circle.splice(index, 1);
    }
    const survivor = circle[0];

    const people: HTMLDivElement[] = [];

    for (let i = 0; i < n; i++) {
        const newPerson = document.createElement('div');
        newPerson.className = 'rounded-full size-5 bg-slate-500 transition-colors duration-100';
        peopleContainer.appendChild(newPerson);
        people.push(newPerson);
    }

    for (let i = 0; i < deadOrder.length; i++) {
        const personIndex = deadOrder[i];
        const personElement = people[personIndex];
        personElement.classList.add('animate-color-change');
        personElement.style.animationDelay = `${i*delay}ms`;
    }

    result.textContent = `The Survivor is #${survivor+1}`;
}

runButton.addEventListener("click", josephusProblem)

josephusProblem();
