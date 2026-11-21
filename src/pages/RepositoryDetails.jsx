import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import { getRepository } from "../services/githubApi";
import { formatCount, formatDate, githubUrl } from "../utils/formatters";
import { parseGithubId } from "../utils/validation";

function RepositoryDetailsBody({ githubId }) {
  const [repository, setRepository] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    getRepository(githubId)
      .then((data) => {
        if (!ignore) {
          setRepository(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [githubId]);

  const href = repository ? githubUrl(repository) : null;

  return (
    <>
      {loading && <LoadingState label="Loading repository…" />}
      {!loading && error && <ErrorMessage message={error.message} details={error.fieldErrors} />}
      {!loading && repository && (
        <article className="detail">
          <h2>{repository.name || "Untitled repository"}</h2>
          <p className="repo-desc">{repository.description || "No description provided."}</p>
          <dl>
            <div>
              <dt>GitHub id</dt>
              <dd>{repository.id}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{repository.owner || "Unknown"}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{repository.language || "Not specified"}</dd>
            </div>
            <div>
              <dt>Stars</dt>
              <dd>{formatCount(repository.stars)}</dd>
            </div>
            <div>
              <dt>Forks</dt>
              <dd>{formatCount(repository.forks)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDate(repository.lastUpdated)}</dd>
            </div>
          </dl>
          {href ? (
            <a className="text-link" href={href} target="_blank" rel="noreferrer">
              Open on GitHub
            </a>
          ) : (
            <p className="hint">A GitHub link needs both an owner and a repository name.</p>
          )}
        </article>
      )}
    </>
  );
}

export default function RepositoryDetails() {
  const { githubId } = useParams();
  const id = parseGithubId(githubId);

  return (
    <section className="page">
      <p className="back">
        <Link to="/saved">Saved repositories</Link>
      </p>
      <h1 className="page-title">Repository details</h1>
      {id == null ? (
        <ErrorMessage message="GitHub id must be a positive whole number." />
      ) : (
        <RepositoryDetailsBody key={id} githubId={id} />
      )}
    </section>
  );
}
