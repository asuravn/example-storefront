import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import {observer} from "mobx-react";
import hoistNonReactStatic from "hoist-non-react-statics";
import shopQuery from "./shop.gql";

/**
 * withShop higher order query component for fetching primaryShopId and shop data
 * @name withShop
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and shop as props
 */
export default function withMerchantShop(Component) {
  @observer
  class MerchantShop extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired,
    };

    render() {
      const {
        router: { query: { shopSlug: shopSlugFromQueryParam } },
      } = this.props;
      
      if (!shopSlugFromQueryParam) {
        return <Component {...this.props} />;
      }

      return (
        <Query errorPolicy="all" query={shopQuery} variables={{ shopSlug: shopSlugFromQueryParam }}>
          {({ data: shopData }) => {
            const { shopBySlug } = shopData || {};
            
            return (
              <Component
                merchant={shopBySlug}
                {...this.props}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(MerchantShop, Component);

  return MerchantShop;
}
