(function () {
	'use strict';

	const host = nodecg.Replicant('host');
	const couch1 = nodecg.Replicant('couch1');
	const couch2 = nodecg.Replicant('couch2');
	const couch3 = nodecg.Replicant('couch3');
	const player1 = nodecg.Replicant('player1');
	const player2 = nodecg.Replicant('player2');
	const player3 = nodecg.Replicant('player3');
	const player4 = nodecg.Replicant('player4');

	// Used to programmatically access any of the above 8 replicants, via `REPLICANTS[name]`.
	const REPLICANTS = {
		host,
		couch1,
		couch2,
		couch3,
		player1,
		player2,
		player3,
		player4
	};

	/**
	 * @customElement
	 * @polymer
	 */
	class DashNameplates extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'dash-nameplates';
		}

		static get properties() {
			return {
				importPath: String // https://github.com/Polymer/polymer-linter/issues/71
			};
		}

		ready() {
			super.ready();

			host.on('change', newVal => {
				this.host = newVal;
			});

			couch1.on('change', newVal => {
				this.couch1 = newVal;
			});

			couch2.on('change', newVal => {
				this.couch2 = newVal;
			});

			couch3.on('change', newVal => {
				this.couch3 = newVal;
			});

			player1.on('change', newVal => {
				this.player1 = newVal;
			});

			player2.on('change', newVal => {
				this.player2 = newVal;
			});

			player3.on('change', newVal => {
				this.player3 = newVal;
			});

			player4.on('change', newVal => {
				this.player4 = newVal;
			});
		}

		hideCouch() {
			this.couchVisible = false;
		}

		showCouch() {
			this.couchVisible = true;
			this.playersVisible = false;
		}

		hidePlayers() {
			this.playersVisible = false;
		}

		showPlayers() {
			this.couchVisible = false;
			this.playersVisible = true;
		}

		_handleSelectedItemChanged(e) {
			if (this._debouncer && this._debouncer.isActive()) {
				return;
			}

			const target = e.target;
			const slot = target.getAttribute('data-slot');
			const replicant = REPLICANTS[slot];

			if (!e.detail.value || !replicant) {
				return;
			}

			// Copy the values out individually, to avoid object reference problems down the line.
			const selectedItem = {
				name: e.detail.value.name,
				info: e.detail.value.info
			};

			// Clear out the target's selected item once we have it.
			e.target.value = null;

			this._debouncer = Polymer.Debouncer.debounce(this._debouncer,
				Polymer.Async.timeOut.after(0),
				() => {
					replicant.value = selectedItem;
				});
		}
	}

	customElements.define(DashNameplates.is, DashNameplates);
})();
