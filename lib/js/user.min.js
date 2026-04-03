/**
 * This file holds The SEO Framework plugin's JS code for the User SEO Settings.
 * Serve JavaScript as an addition, not as an ends or means.
 *
 * @author Sybre Waaijer <https://cyberwire.nl/>
 * @link <https://wordpress.org/plugins/autodescription/>
 */

/**
 * The SEO Framework plugin
 * Copyright (C) 2025 Sybre Waaijer, CyberWire B.V. (https://cyberwire.nl/)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

/**
 * Holds tsfUser values in an object to avoid polluting global namespace.
 *
 * @since 5.1.5
 *
 * @constructor
 */
window.tsfUser = function () {

	/**
	 * Data property injected by WordPress l10n handler.
	 *
	 * @since 5.1.5
	 * @access public
	 * @type {(Object<string,*>)|Boolean|null} l10n Localized strings
	 */
	const l10n = tsfUserL10n;

	/**
	 * @since 5.1.5
	 * @access private
	 * @type {string}
	 */
	const _titleId = 'tsf-user-meta[doctitle]';
	/**
	 * @since 5.1.5
	 * @access private
	 * @type {string}
	 */
	const _descId = 'tsf-user-meta[description]';

	/**
	 * @since 5.1.5
	 * @access private
	 * @type {string}
	 */
	const _socialGroup = 'tsf_user_social_tt';

	/**
	 * Initializes Title meta input listeners.
	 *
	 * @since 5.1.5
	 * @access private
	 */
	function _initTitleListeners() {

		const titleInput = document.getElementById( _titleId );
		if ( ! titleInput ) return;

		tsfTitle.setInputElement( titleInput );

		const state = JSON.parse(
			document.getElementById( `tsf-title-data_${_titleId}` )?.dataset.state || 0,
		);

		if ( state ) {
			tsfTitle.updateStateOf( _titleId, 'allowReferenceChange', ! state.refTitleLocked );
			tsfTitle.updateStateOf( _titleId, 'defaultTitle', state.defaultTitle.trim() );
			tsfTitle.updateStateOf( _titleId, 'addAdditions', state.addAdditions );
			tsfTitle.updateStateOf( _titleId, 'useSocialTagline', !! ( state.useSocialTagline || false ) );
			tsfTitle.updateStateOf( _titleId, 'additionValue', state.additionValue.trim() );
			tsfTitle.updateStateOf( _titleId, 'additionPlacement', state.additionPlacement );
		}

		/**
		 * Updates title additions, based on singular settings change.
		 *
		 * @function
		 * @param {Event} event
		 */
		const updateTitleAdditions = event => {
			let addAdditions = ! event.target.checked;

			if ( l10n.params.additionsForcedDisabled )
				addAdditions = false;

			tsfTitle.updateStateOf( _titleId, 'addAdditions', addAdditions );
		}
		const blogNameTrigger = document.getElementById( 'tsf-user-meta[title_no_blog_name]' );
		if ( blogNameTrigger ) {
			blogNameTrigger.addEventListener( 'change', updateTitleAdditions );
			blogNameTrigger.dispatchEvent( new Event( 'change' ) );
		}

		tsfTitle.enqueueUnregisteredInputTrigger( _titleId );
	}

	/**
	 * Initializes description meta input listeners.
	 *
	 * @since 5.1.5
	 * @access private
	 */
	function _initDescriptionListeners() {

		const descInput = document.getElementById( _descId );
		if ( ! descInput ) return;

		tsfDescription.setInputElement( descInput );

		const state = JSON.parse(
			document.getElementById( `tsf-description-data_${_descId}` )?.dataset.state || 0,
		);
		if ( state ) {
			tsfDescription.updateStateOf( _descId, 'defaultDescription', state.defaultDescription.trim() );
		}

		tsfDescription.enqueueUnregisteredInputTrigger( _descId );
	}

	/**
	 * Initializes social meta input listeners.
	 *
	 * @since 5.1.5
	 * @access private
	 */
	function _initSocialListeners() {

		tsfSocial.setInputInstance( _socialGroup, _titleId, _descId );

		const groupData = JSON.parse(
			document.getElementById( `tsf-social-data_${_socialGroup}` )?.dataset.settings || 0,
		);
		if ( ! groupData ) return;

		tsfSocial.updateStateOf( _socialGroup, 'addAdditions', groupData.og.state.addAdditions );

		tsfSocial.updateStateOf(
			_socialGroup,
			'defaults',
			{
				ogTitle: groupData.og.state.defaultTitle,
				twTitle: groupData.tw.state.defaultTitle,
				ogDesc:  groupData.og.state.defaultDesc,
				twDesc:  groupData.tw.state.defaultDesc,
			}
		);
	}

	/**
	 * Initializes settings scripts on TSF-load.
	 *
	 * @since 5.1.5
	 * @access private
	 */
	function _loadSettings() {
		[
			_initTitleListeners,
			_initDescriptionListeners,
			_initSocialListeners,
		].forEach( fn => {
			try {
				fn();
			} catch ( error ) {
				console.error( `Error in ${fn.name}:`, error );
			}
		} );
	}

	return Object.assign( {
		/**
		 * Initialises all aspects of the scripts.
		 * You shouldn't call this.
		 *
		 * @since 5.1.5
		 * @access protected
		 *
		 * @function
		 */
		load: () => {
			document.body.addEventListener( 'tsf-onload', _loadSettings );
		},
	}, {
		l10n,
	} );
}();
window.tsfUser.load();
