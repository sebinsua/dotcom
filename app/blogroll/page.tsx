import { css } from "@linaria/core";

import { createMetadata } from "@lib/createMetadata";

import { Page } from "@components/Page";

export async function generateMetadata() {
  return createMetadata({
    title: "Blogroll",
    slug: "blogroll",
  });
}

export default function BlogrollPage() {
  return (
    <Page title="Blogroll" slug="/blogroll">
      <div
        className={css`
          margin-top: 1.475em;
          background: linear-gradient(
            100deg,
            #ff9269 15%,
            #f76631 35%,
            #1778e9
          );
          text-decoration: none;
          background-clip: text;
          -webkit-background-clip: text;
          pre {
            display: inline;
            padding: 0;
            font-weight: normal;
            color: black;
            font-style: normal;
          }
          em {
            font-weight: bold;
          }
          strong,
          a {
            color: rgba(255, 255, 255, 0);
            /* See: https://bugs.webkit.org/show_bug.cgi?id=169125 */
            background-clip: text;
            -webkit-background-clip: text;
          }
        `}
      >
        <p>
          I highly recommend the works of the following bloggers and have
          selected an article for each that, while not necessarily their most
          well-known, showcases the quality of their content. Some of the
          writers no longer maintain active blogs, having moved on to other
          pursuits, while others are lesser-known but offer insightful thinking.
          They all offer though-provoking perspectives and are well worth
          reading.
        </p>
        <ul>
          <li>
            <a href="https://christopherolah.wordpress.com/2011/07/31/you-already-know-calculus-derivatives/">
              <em>“You Already Know Calculus: Derivatives”</em> (2011)
            </a>{" "}
            by <a href="https://colah.github.io/">Christopher Olah</a>{" "}
            demystifies calculus by explaining derivatives through intuitive
            everyday life examples.
          </li>
          <li>
            <a href="https://dominictarr.com/post/154769946347/fairly-tale-cryptography-2-hashes">
              <em>“Fairy Tale Cryptography 2: Hashes”</em> (2017)
            </a>{" "}
            by <a href="https://dominictarr.com/">Dominic Tarr</a> uses the
            story of Cinderella to explain the concept of cryptographic hashes.
          </li>
          <li>
            <a href="https://jessitron.com/2021/01/18/when-costs-are-nonlinear-keep-it-small/">
              <em>“When costs are nonlinear, keep it small”</em> (2021)
            </a>{" "}
            by <a href="https://jessitron.com/">Jessica Kerr</a> highlights the
            importance of avoiding batching in systems with nonlinear costs,
            such as software deployment, to prevent increased risks and
            escalating costs.
          </li>
          <li>
            <a href="https://sophiebits.com/2018/12/03/yak-shaving-fixing.html">
              <em>“Yak shaving and fixing”</em> (2018)
            </a>{" "}
            by <a href="https://sophiebits.com/">Sophie Alpert</a> emphasizes
            the value of fixing bugs and enhancing tools, even when not directly
            related to one’s immediate goal, to boost productivity for the whole
            team/org.
          </li>
          <li>
            <a href="https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction">
              <em>“The Wrong Abstraction”</em> (2016)
            </a>{" "}
            by <a href="https://sandimetz.com/">Sandi Metz</a> examines the
            pitfalls of incorrect abstractions in code, advocating for inlining
            code and embracing duplication as a stepping stone to more
            meaningful abstractions.
          </li>
          <li>
            <a href="https://sarkology.wordpress.com/2018/05/19/orthogonality/">
              <em>“Orthogonality”</em> (2018)
            </a>{" "}
            by the prolific aphorist{" "}
            <a href="https://mulledthoughts.substack.com">Guo Liang Oon</a>{" "}
            delineates between modularity and orthogonality in problem-solving,
            identifying the former as focusing on “ownership” and the latter on
            “obliviousness”, and encourages us to strive toward embracing
            orthogonality.
          </li>
          <li>
            <a href="https://wordsandbuttons.online/programmers_guide_to_polynomials_and_splines.html">
              <em>“Programmer’s guide to polynomials and splines”</em> (2019)
            </a>{" "}
            by <a href="https://wordsandbuttons.online/">Oleksandr Kaleniuk</a>{" "}
            delves into the foundations of polynomials and splines, offering
            insights into their practical applications and uses in software
            development.
          </li>
          <li>
            <a href="https://chidiwilliams.com/post/quadtrees/">
              <em>“Quadtrees in the Wild”</em> (2021)
            </a>{" "}
            by <a href="https://chidiwilliams.com/">Chidi Williams</a> offers a
            captivating, hands-on learning experience on quadtrees, highlighting
            real-world applications like image compression and collision
            detection through interactive visualisations.
          </li>
          <li>
            <a href="https://two-wrongs.com/data-consistency-is-overrated.html">
              <em>“Data Consistency Is Overrated”</em> (2023)
            </a>{" "}
            by <a href="https://xkqr.org/profile">Christoffer Stjernlöf</a>{" "}
            discusses the discrepancy between the expectations of software
            engineers and domain experts with regards to data consistency,
            observing that within the real world, often all that is required is
            for data to be evolved and errors corrected until the results are
            within the bounds acceptable to the system owner.
          </li>
          <li>
            <a href="https://jvns.ca/blog/2015/04/14/strace-zine/">
              <em>
                “How to spy on your programs with <pre>`strace`</pre>”
              </em>{" "}
              (2015)
            </a>{" "}
            by <a href="https://jvns.ca/">Julia Evans</a>, an educator known for
            creating visually engaging and beginner-friendly comics, offers an
            accessible introduction to using the <pre>`strace`</pre> tool for
            debugging and monitoring program behavior on Linux systems.
          </li>
          <li>
            <a href="https://tiarkrompf.github.io/notes/?/just-write-the-parser/">
              <em>“Just write the #!%/* parser”</em> (2019)
            </a>{" "}
            by <a href="https://tiarkrompf.github.io/">Tiark Rompf</a> is a
            hands-on guide written in a literate programming style that walks
            the reader through implementing a parser by hand all the way up to
            adding support for arbitrary operators with varying precedence
            levels and associativity behaviours.
          </li>
          <li>
            <a href="https://danluu.com/file-consistency/">
              <em>“Files are hard”</em> (2017)
            </a>{" "}
            by <a href="https://danluu.com/">Dan Luu</a> examines the
            intricacies and hurdles in developing reliable file systems and
            managing errors in application code, underscoring the importance of
            better testing methods.
          </li>
          <li>
            <a href="https://lethain.com/learn-to-never-be-wrong/">
              <em>“Learn to never be wrong”</em> (2020)
            </a>{" "}
            by <a href="https://lethain.com/">Will Larson</a> discusses how to
            achieve correctness without dominating conversations, by seeking the
            best outcome for everyone, demonstrating a willingness to change
            one’s initial stance, and embracing the belief that there is always
            an additional piece of context that reconciles seemingly conflicting
            perspectives into a unified view.
          </li>
          <li>
            <a href="https://macwright.com/2021/02/17/the-naming-of-things.html">
              <em>“The naming of things”</em> (2021)
            </a>{" "}
            by <a href="https://macwright.com/">Tom MacWright</a> emphasizes the
            value of clear and purposeful naming in programming, arguing that
            thoughtful names foster trust and comprehension in a codebase,
            streamlining its accessibility and maintenance.
          </li>
          <li>
            <a href="https://lord.io/spreadsheets/">
              <em>“How to recalculate a spreadsheet”</em> (2020)
            </a>{" "}
            by <a href="https://lord.io/">Robert Lord</a> is a comprehensive
            guide that traces the evolution of spreadsheet calculation methods,
            from basic techniques to increasingly performant and sophisticated
            approaches.
          </li>
          <li>
            <a href="https://koolaidfactory.com/writing-in-public-inside-your-company/">
              <em>“Writing In Public, Inside Your Company”</em> (2021)
            </a>{" "}
            by <a href="https://www.briewolfson.com">Brie Wolfson</a> highlights
            the importance of a strong writing culture in organizations like
            Stripe, and shares insights on cultivating such a culture by
            creating infrastructure, including papertrails, curations, editorial
            systems, and distribution strategies, to encourage writing and
            idea-sharing across the organisation.
          </li>
          <li>
            <a href="https://macroresilience.substack.com/p/metrics-codification-and-objectivity">
              <em>“Metrics, codification and objectivity”</em> (2022)
            </a>{" "}
            by{" "}
            <a href="https://www.macroresilience.com/">Ashwin Parameswaran</a>,{" "}
            a prolific systems-thinker, argues that although systems without
            human discretion are preferred for their objectivity, the resulting
            loss of accountability and escalating codification ultimately leads
            to dysfunctionality.
          </li>
          <li>
            <a href="https://www.patrickstevens.co.uk/posts/2021-02-20-in-praise-of-dry-run/">
              <em>
                “In praise of <pre>`--dry-run`</pre>”
              </em>{" "}
              (2021)
            </a>{" "}
            by <a href="https://www.patrickstevens.co.uk">Patrick Stevens</a>{" "}
            discusses the use of “defunctionalisation” and other techniques to
            implement <pre>`--dry-run`</pre> modes to enhance the user
            experience of our tools.
          </li>
          <li>
            <a href="https://carcinisation.com/2014/08/11/beauty-is-fit/">
              <em>“Beauty is Fit”</em> (2014)
            </a>{" "}
            by{" "}
            <a href="https://www.ribbonfarm.com/author/sarahperry/">
              Sarah Perry
            </a>{" "}
            argues that beauty is not a mystical, irreducible quality, but an
            ultimately computational feature arising from the detection of fit
            within systems, with computationally generated fit potentially being
            more satisfying and harmonious to human minds than that generated by
            humans alone.
          </li>
          <li>
            <a href="https://thesublemon.tumblr.com/post/185806217082/pornography-vs-fetishism">
              <em>“Pornography vs fetishism”</em> (2021)
            </a>{" "}
            by <a href="http://haleythurston.com/writing">Haley Thurston</a> (
            <a href="https://thesublemon.tumblr.com/tagged/posts:%20art">
              see also
            </a>
            ) argues for the value of art with a “pornographic ethos”, which
            involves building expectations and desires before satisfying them,
            contrasting this with fetishism in art, which involves indulgence in
            specific interests or desires that may not fit coherently within the
            larger context of the work.
          </li>
          <li>
            <a href="https://lipoblog.wordpress.com/2016/02/01/chords-and-maps-3/">
              <em>“Chords and Maps”</em> (2016)
            </a>{" "}
            by <a href="https://lipoblog.wordpress.com/">Gabriel Duquette</a>{" "}
            identifies two ways of seeing fit in art, aesthetic fit that deals
            with sensory experiences, and abstraction fit that deals with
            representations of reality.
          </li>
          <li>
            <a href="https://gravitylobby.club/dewey.html">
              <em>“Refactoring Aesthetics”</em> (2017)
            </a>{" "}
            by <a href="https://gravitylobby.club">Chris Beiser</a> contains a
            primer on some ideas from the philosopher John Dewey relating to
            aesthetic fulfillment.
          </li>
          <li>
            <a href="https://web.archive.org/web/20160306114307/http://szabo.best.vwh.net/history.html">
              <em>“History and the Security of Property”</em> (2006)
            </a>{" "}
            by <a href="https://unenumerated.blogspot.com/">Nick Szabo</a>{" "}
            explores the role of physical and geographical factors in securing
            farmland and other resources, and how these factors influenced
            political systems and legal structures, while questioning their
            suitability for securing emerging forms of wealth, such as
            information.
          </li>
          <li>
            <a href="https://www.igvita.com/2014/05/05/minimum-viable-block-chain/">
              <em>“Minimum Viable Blockchain”</em> (2014)
            </a>{" "}
            by <a href="https://www.igvita.com/">Ilya Grigorik</a> explores the
            fundamental concepts and challenges of building a secure,
            decentralized ledger system, discussing how to protect it from Sybil
            attacks and double-spending, while also addressing the need for
            incentivizing network participants.
          </li>
          <li>
            <a href="https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html">
              <em>“What’s up with monomorphism?”</em> (2015)
            </a>{" "}
            by <a href="https://mrale.ph/">Vyacheslav Egorov</a> explores
            JavaScript optimization techniques, emphasizing the benefits of
            monomorphic operations and the challenges of optimizing polymorphic
            and megamorphic operations.
          </li>
          <li>
            <a href="https://thume.ca/2023/01/02/one-machine-twitter/">
              <em>
                “Production Twitter on One Machine? 100Gbps NICs and NVMe are
                fast”
              </em>{" "}
              (2023)
            </a>{" "}
            by <a href="https://thume.ca/">Tristan Hume</a> is a fun,
            educational exercise on whether it is possible to design a system
            that could serve the full production load of Twitter with most of
            its features intact on a single machine.
          </li>
          <li>
            <a href="http://catern.com/compdist.html">
              <em>“Your computer is a distributed system”</em> (2022)
            </a>{" "}
            by <a href="http://catern.com">Spencer Baugh</a> argues that most
            computers are actually distributed systems with many components
            running concurrently and communicating over internal buses, and
            explores the implications of this for programming and performance.
          </li>
          <li>
            <a href="https://cprimozic.net/blog/reverse-engineering-a-small-neural-network/">
              <em>
                “Reverse engineering a neural network’s clever solution to
                binary addition”
              </em>{" "}
              (2023)
            </a>{" "}
            by <a href="https://cprimozic.net/">Casey Primozic</a> explores the
            surprising mechanics behind how a neural network learns to
            accomplish binary addition.
          </li>
        </ul>
      </div>
    </Page>
  );
}
