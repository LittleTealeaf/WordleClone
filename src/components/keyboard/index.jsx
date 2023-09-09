import "./style.css";

const CORRECT = 3;
const PARTIAL = 2;
const INCORRECT = 1;
const DEFAULT = 0;

function LetterKey({ letter, key, state, onClick }) {
	return (
		<div key={key} className="key" data-state={state} onClick={onClick}>
			{letter}
		</div>
	);
}

export default function Keyboard({
	correct,
	incorrect,
	partial,
	onLetter,
	onBackspace,
	onSubmit,
}) {
	let states = {};
	"abcdefghijklmnopqrstuvwxyz".split("").forEach((letter) => {
		if (correct?.includes(letter)) {
			states[letter] = CORRECT;
		} else if (partial?.includes(letter)) {
			states[letter] = PARTIAL;
		} else if (incorrect?.includes(letter)) {
			states[letter] = INCORRECT;
		} else {
			states[letter] = DEFAULT;
		}
	});

	return (
		<>
			<div className="keyboard">
				<div className="row">
					{["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(
						(letter, key) => (
							<div
								key={key}
								className="key"
								data-state={states[letter]}
								onClick={() => onLetter(letter)}
							>
								{letter}
							</div>
						),
					)}
				</div>
				<div className="row">
					{["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((letter, key) => (
						<div
							key={key}
							className="key"
							data-state={states[letter]}
							onClick={() => onLetter(letter)}
						>
							{letter}
						</div>
					))}
				</div>
				<div className="row">
					<div
						className="key submit"
						data-state={DEFAULT}
						onClick={() => onSubmit()}
					>
						{"Enter"}
					</div>
					{["z", "x", "c", "v", "b", "n", "m"].map((letter, key) => (
						<div
							key={key}
							className="key"
							data-state={states[letter]}
							onClick={() => onLetter(letter)}
						>
							{letter}
						</div>
					))}
					<div
						className="key submit"
						data-state={DEFAULT}
						onClick={() => onBackspace()}
					>
						{"Delete"}
					</div>
				</div>
			</div>
		</>
	);
}
