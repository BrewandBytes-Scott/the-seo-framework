<?php
/**
 * @package The_SEO_Framework\Classes\Data\Filter\Term
 * @subpackage The_SEO_Framework\Data\Term
 */

namespace The_SEO_Framework\Data\Filter;

\defined( 'THE_SEO_FRAMEWORK_PRESENT' ) or die;

use The_SEO_Framework\Meta;

/**
 * The SEO Framework plugin
 * Copyright (C) 2023 - 2025 Sybre Waaijer, CyberWire B.V. (https://cyberwire.nl/)
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
 * Holds a collection of user meta sanitization methods.
 *
 * @since 5.0.0
 * @access private
 */
final class User {

	/**
	 * @hook "sanitize_usermeta_ . THE_SEO_FRAMEWORK_USER_OPTIONS" 10
	 * @since 5.0.0
	 *
	 * @param mixed[] $meta_value An unsanitized value.
	 * @return array[] The sanitized user meta.
	 */
	public static function filter_meta_update( $meta_value ) {

		// If registered metadata yields empty -- do not unset key! It'll override "defaults" that way.
		foreach ( $meta_value as $key => &$value ) {
			switch ( $key ) {
				case 'facebook_page':
					$value = Sanitize::facebook_profile_link( $value );
					break;

				case 'twitter_page':
					$value = Sanitize::twitter_profile_handle( $value );
					break;

				// This is a preference rather than a user setting...
				// TODO split this to another key and use ex. "filter_preference_update"
				case 'counter_type':
					$value = \absint( $value );

					if ( $value > 3 )
						$value = 0;
					break;

				case 'doctitle':
				case 'og_title':
				case 'tw_title':
				case 'description':
				case 'og_description':
				case 'tw_description':
					$value = Sanitize::metadata_content( $value );
					break;

				case 'canonical':
				case 'social_image_url':
					$value = \sanitize_url( $value, [ 'https', 'http' ] );
					break;

				case 'social_image_id':
					$value = empty( $meta_value['social_image_url'] ) ? 0 : \absint( $value );
					break;

				case 'noindex':
				case 'nofollow':
				case 'noarchive':
					$value = Sanitize::qubit( $value );
					break;

				case 'redirect':
					$value = Sanitize::redirect_url( $value );
					break;

				case 'title_no_blog_name':
					$value = Sanitize::boolean_integer( $value );
					break;

				case 'tw_card_type':
					if ( ! \in_array( $value, Meta\Twitter::get_supported_cards(), true ) )
						$value = '';
					break;

				default:
					unset( $meta_value[ $key ] );
			}
		}

		// Store an empty array on failure. Data\Plugin\User::get_meta() repopulates it on demand.
		return $meta_value ?: [];
	}
}
