(function () {
    const videoBox = document.getElementById('x10-video-box');

	/**
	 * @customElement
	 * @polymer
	 */
    class X10VideoBox extends Polymer.Element {
        static get is() {
            return 'x10-video-box';
        }

        static get properties() {
            return {
                logoUrls: {
                    type: Array,
                    value: [
                        'url("img/sponsors/affinity_1.png")',
                        'url("img/sponsors/affinity_2.png")']
                },
                duration: {
                    type: Number,
                    value: 17
                },
                interval: {
                    type: Number,
                    value: 10 * 60
                },
                fadeTime: {
                    type: Number,
                    value: 0.5
                },
                showing: {
                    type: Boolean,
                    reflectToAttribute: true,
                    value: false
                }
            };
        }

        ready() {
            super.ready();
        }

        show() {
            const self = this;

            // Indicate that we are showing
            this.showing = true;
        }
    }

    customElements.define(X10VideoBox.is, X10VideoBox);
})();
