import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <footer className="footer main-footer">
      <div className="content has-text-centered">
        <p>Developed with &nbsp;<FontAwesomeIcon icon={faHeart} color='red' />&nbsp; by <a target='_blank' href='https://github.com/pranavj1001'>Pranav Jain</a></p>
      </div>
    </footer>
  );
}

export default Footer;