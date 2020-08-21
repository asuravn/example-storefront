import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { addTypographyStyles, applyTheme, CustomPropTypes, preventAccidentalDoubleClick } from "@reactioncommerce/components/utils";

const ProductMediaWrapper = styled.div`
  background-color: ${applyTheme("CatalogGridItem.mediaBackgroundColor")};
  position: relative;
`;

const ProductInfo = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: ${applyTheme("CatalogGridItem.verticalSpacingBetweenImageAndInfo")};
`;

const ProductTitle = styled.aside`
  ${addTypographyStyles("CatalogGridItemProductTitle", "headingTextBold")}
  line-height: 1.125;
`;

const ProductVendor = styled.span`
  ${addTypographyStyles("CatalogGridItemProductVendor", "labelText")}
`;

const PriceContainer = styled.div`
  text-align: right;
`;

class ShopGridItem extends Component {
  static propTypes = {
    /**
     * Labels to use for the various badges. Refer to `BadgeOverlay`'s prop documentation.
     */
    badgeLabels: PropTypes.shape({
      BACKORDER: PropTypes.string,
      BESTSELLER: PropTypes.string,
      LOW_QUANTITY: PropTypes.string,
      SOLD_OUT: PropTypes.string,
      SALE: PropTypes.string
    }),
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using
     * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      BadgeOverlay: CustomPropTypes.component.isRequired,
      Link: CustomPropTypes.component.isRequired,
      Price: CustomPropTypes.component.isRequired,
      ProgressiveImage: CustomPropTypes.component.isRequired
    }),
    /**
     * Currency code to display the price for. Product must include a pricing object with the code in `product.pricing`
     */
    currencyCode: PropTypes.string.isRequired,
    /**
     * Item click handler
     */
    onClick: PropTypes.func,
    /**
     * Image to display when product doesn't have a primary image
     */
    placeholderImageURL: PropTypes.string,
    /**
     * Product to display
     */
    shop: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      owner: PropTypes.string,
      shopLogoUrls: PropTypes.shape({
        primaryShopLogoUrl: PropTypes.string
      }),
      productCount: PropTypes.number
    })
  };
  
  static defaultProps = {
    badgeLabels: null,
    onClick() {},
    placeholderImageURL: ""
  };
  
  state = {
    fit: "cover"
  };
  
  componentDidMount() {
    this._mounted = true;
    
    this.setImageFit();
  }
  
  componentDidUpdate() {
    this.setImageFit();
  }
  
  componentWillUnmount() {
    this._mounted = false;
  }
  
  setImageFit = () => {
    // Use cover fit if image is landcape, contain if portrait
    if (typeof Image !== "undefined") {
      const { large } = this.primaryImage.URLs;
      const largeImage = new Image();
      largeImage.src = large;
      largeImage.onload = () => {
        if (this._mounted === false) {
          return;
        }
        
        let fit = "";
        const { width, height } = largeImage;
        if (height > width) {
          // Image is portrait
          fit = "contain";
        } else {
          // Image is landscape
          fit = "cover";
        }
        
        if (fit !== this.state.fit) {
          this.setState({ fit });
        }
      };
    }
  };
  
  get shopDetailHref() {
    const { shop: { slug } } = this.props;
    const url = `/shop/${slug}`;
    return url;
  }
  
  get primaryImage() {
    const { shop: {shopLogoUrls}, placeholderImageURL } = this.props;
    if (!shopLogoUrls || !shopLogoUrls.primaryShopLogoUrl) {
      return {
        URLs: {
          thumbnail: placeholderImageURL,
          small: placeholderImageURL,
          medium: placeholderImageURL,
          large: placeholderImageURL
        }
      };
    }
    
    return {
      URLs: {
        thumbnail: shopLogoUrls.primaryShopLogoUrl,
        small: shopLogoUrls.primaryShopLogoUrl,
        medium: shopLogoUrls.primaryShopLogoUrl,
        large: shopLogoUrls.primaryShopLogoUrl
      }
    };
  }
  
  handleOnClick = preventAccidentalDoubleClick((event) => {
    this.props.onClick(event, this.props.shop);
  });
  
  renderProductMedia() {
    const { components: { ProgressiveImage }, shop: { description } } = this.props;
    const { fit } = this.state;
    
    return (
      <ProductMediaWrapper>
        <ProgressiveImage
          fit={fit}
          altText={description}
          presrc={this.primaryImage.URLs.thumbnail}
          srcs={this.primaryImage.URLs}
        />
      </ProductMediaWrapper>
    );
  }
  
  renderProductInfo() {
    const {
      shop: { name, owner }
    } = this.props;
    return (
      <div>
        <ProductInfo>
          <ProductTitle>{name}</ProductTitle>
        </ProductInfo>
        <div>
          <ProductVendor>{owner}</ProductVendor>
        </div>
      </div>
    );
  }
  
  render() {
    const { className, components: { Link } } = this.props;
    
    return (
      <div className={className}>
        <Link
          href={this.shopDetailHref}
          onClick={this.handleOnClick}
        >
          <div>
            {this.renderProductMedia()}
            {this.renderProductInfo()}
          </div>
        </Link>
      </div>
    );
  }
}

export default withComponents(ShopGridItem);
