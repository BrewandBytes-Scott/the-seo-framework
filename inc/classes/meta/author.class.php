<?php
/**
 * @package The_SEO_Framework\Classes\Meta
 * @subpackage The_SEO_Framework\Meta\Author
 */

namespace The_SEO_Framework\Meta;

\defined( 'THE_SEO_FRAMEWORK_PRESENT' ) or die;

use The_SEO_Framework\{
	Data,
	Helper\Query,
};

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

/**
 * Holds getters for author meta tag output.
 *
 * @since 5.1.5
 * @access protected
 *         Use tsf()->author() instead.
 */
class Author {

	/**
	 * Returns the author name for the current query.
	 *
	 * @since 5.1.5
	 *
	 * @return string The author name. Empty string if unavailable.
	 */
	public static function get_author_name() {

		if ( ! \is_single() )
			return '';

		$author_id = Query::get_post_author_id();

		if ( $author_id ) {
			$user_data = Data\User::get_userdata( $author_id );

			if ( ! empty( $user_data->display_name ) )
				return $user_data->display_name;
		}

		return Data\Plugin::get_option( 'post_author' ) ?: '';
	}
}
