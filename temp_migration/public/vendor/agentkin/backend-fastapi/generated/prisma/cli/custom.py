import click

from .utils import PrismaCLI


@click.command(cls=PrismaCLI, context_settings=dict(auto_envvar_prefix='PRISMA_PY'))
def cli() -> None:
    """Custom command line arguments specifically for
    Prisma Client Python.

    For other prisma commands, see prisma --help
    """

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
